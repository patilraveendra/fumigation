using System.Linq;
using System.Text.Json;
using System.IO;
using System.Diagnostics;
using Serilog;
using Serilog.Events;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IDatabaseService, DatabaseService>();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.Converters.Add(new NullableDateTimeConverter());
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? (Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")?.Split(';') ?? new[] { "http://localhost:5173" });

// Ensure production frontend origin is present when deployed
var extras = new[] { "https://crmpestandsolutions.in", "https://www.crmpestandsolutions.in" };
allowedOrigins = allowedOrigins.Concat(extras).Distinct().ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        // Allow the configured origins and wildcard subdomains (use carefully)
        policy
            .WithOrigins(allowedOrigins)
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Configure Serilog for file + console logging
var logsPath = Path.Combine(builder.Environment.ContentRootPath, "logs");
Directory.CreateDirectory(logsPath);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(Path.Combine(logsPath, "log-.txt"), rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30)
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration failed: {ex.Message}");
    }
}

app.UseCors("LocalFrontend");

// Use Serilog's request logging middleware (records requests/responses)
app.UseSerilogRequestLogging();

var store = new CertificateStore(app.Environment.ContentRootPath);

// Diagnostic endpoint for CORS debugging — echoes headers and whether Origin is allowed
app.MapGet("/debug", (HttpContext ctx) =>
{
    var origin = ctx.Request.Headers["Origin"].ToString();
    var headers = ctx.Request.Headers.ToDictionary(k => k.Key, v => v.Value.ToString());
    var originAllowed = !string.IsNullOrEmpty(origin) && allowedOrigins.Any(o => string.Equals(o, origin, StringComparison.OrdinalIgnoreCase));

    return Results.Ok(new
    {
        origin = origin,
        originAllowed = originAllowed,
        allowedOrigins = allowedOrigins,
        headers = headers,
    });
});

app.MapGet("/", () => Results.Ok(new
{
    name = "Fumigation API",
    endpoints = new[] { "POST /api/certificates", "GET /api/certificates" },
}));

app.MapPost("/api/certificates", async (JsonElement payload) =>
{
    if (payload.ValueKind != JsonValueKind.Object)
    {
        return Results.BadRequest(new { message = "Request body must be a JSON object." });
    }

    var saved = await store.SaveAsync(payload);

    return Results.Created($"/api/certificates/{saved.Id}", saved);
});

app.MapGet("/api/certificates", async () =>
{
    var records = await store.GetAllAsync();

    return Results.Ok(records);
});

// SQL-backed MB Certificate endpoints
app.MapPost("/api/mb/certificates", async (MbCertificate record, IDatabaseService db) =>
{
    try
    {
        var saved = await db.SaveMbCertificateAsync(record);
        return Results.Created($"/api/mb/certificates/{saved.CertificateId}", saved);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message, type = ex.GetType().Name });
    }
});

app.MapGet("/api/mb/certificates", async (IDatabaseService db) =>
{
    var records = await db.GetAllMbCertificatesAsync();
    return Results.Ok(records);
});

// SQL-backed ALP Certificate endpoints
app.MapPost("/api/alp/certificates", async (AlpCertificate record, IDatabaseService db) =>
{
    try
    {
        var saved = await db.SaveAlpCertificateAsync(record);
        return Results.Created($"/api/alp/certificates/{saved.CertificateId}", saved);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message, type = ex.GetType().Name });
    }
});

app.MapGet("/api/alp/certificates", async (IDatabaseService db) =>
{
    var records = await db.GetAllAlpCertificatesAsync();
    return Results.Ok(records);
});

try
{
    app.Run();
}
finally
{
    Log.CloseAndFlush();
}

public sealed record CertificateRecord(
    Guid Id,
    DateTimeOffset CreatedAtUtc,
    JsonElement Data);

public sealed class CertificateStore
{
    private static readonly SemaphoreSlim FileLock = new(1, 1);
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly string filePath;

    public CertificateStore(string contentRootPath)
    {
        var monthName = DateTimeOffset.UtcNow.ToString("MMMM").ToLowerInvariant();
        var monthDirectory = Path.Combine(contentRootPath, "Data", monthName);
        Directory.CreateDirectory(monthDirectory);
        filePath = Path.Combine(monthDirectory, "certificates.json");
    }

    public async Task<IReadOnlyList<CertificateRecord>> GetAllAsync()
    {
        await FileLock.WaitAsync();

        try
        {
            return await ReadRecordsAsync();
        }
        finally
        {
            FileLock.Release();
        }
    }

    public async Task<CertificateRecord> SaveAsync(JsonElement payload)
    {
        await FileLock.WaitAsync();

        try
        {
            var records = await ReadRecordsAsync();
            var saved = new CertificateRecord(
                Guid.NewGuid(),
                DateTimeOffset.UtcNow,
                payload.Clone());

            records.Add(saved);

            await using var stream = File.Create(filePath);
            await JsonSerializer.SerializeAsync(stream, records, JsonOptions);

            return saved;
        }
        finally
        {
            FileLock.Release();
        }
    }

    private async Task<List<CertificateRecord>> ReadRecordsAsync()
    {
        if (!File.Exists(filePath))
        {
            return [];
        }

        await using var stream = File.OpenRead(filePath);
        var records = await JsonSerializer.DeserializeAsync<List<CertificateRecord>>(stream, JsonOptions);

        return records ?? [];
    }
}
