# Fumigation API

Simple local .NET API for saving fumigation certificate submissions as JSON.

## Run

```bash
dotnet run --project api/FumigationApi
```

To force a local HTTP port:

```bash
dotnet run --project api/FumigationApi --urls http://localhost:5088
```

## Endpoints

```http
POST /api/certificates
Content-Type: application/json
```

Saves the posted JSON object to `api/FumigationApi/Data/certificates.json`.

Example:

```bash
curl -X POST http://localhost:5088/api/certificates \
  -H "Content-Type: application/json" \
  -d '{"certificateType":"MB","certificateNumber":"TC6788","exporterName":"Test Exporter"}'
```

```http
GET /api/certificates
```

Returns all saved certificate submissions.
