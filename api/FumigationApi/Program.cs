using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

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
