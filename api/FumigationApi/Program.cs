using System.Text.Json;
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

var store = new CertificateStore(app.Environment.ContentRootPath);

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

app.Run();

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
