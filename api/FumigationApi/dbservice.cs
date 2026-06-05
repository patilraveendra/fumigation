
using Microsoft.EntityFrameworkCore;

public interface IDatabaseService
{
    Task<MbCertificate> SaveMbCertificateAsync(MbCertificate record);
    Task<AlpCertificate> SaveAlpCertificateAsync(AlpCertificate record);
    Task<List<MbCertificate>> GetAllMbCertificatesAsync();
    Task<List<AlpCertificate>> GetAllAlpCertificatesAsync();
}

public class DatabaseService : IDatabaseService
{
    private readonly AppDbContext _context;

    public DatabaseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<MbCertificate> SaveMbCertificateAsync(MbCertificate record)
    {
        if (record.CertificateId > 0)
        {
            var existing = await _context.MbCertificates.Include(c => c.Containers).FirstOrDefaultAsync(c => c.CertificateId == record.CertificateId);
            if (existing != null)
            {
                // update scalar properties
                _context.Entry(existing).CurrentValues.SetValues(record);
                existing.UpdatedDate = DateTime.Now;

                // replace containers: remove old and add new
                _context.MbContainers.RemoveRange(existing.Containers);
                existing.Containers = record.Containers ?? new List<MbContainer>();

                await _context.SaveChangesAsync();
                return existing;
            }
        }

        record.CreatedDate = DateTime.Now;
        record.UpdatedDate = DateTime.Now;
        _context.MbCertificates.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<AlpCertificate> SaveAlpCertificateAsync(AlpCertificate record)
    {
        // Ensure DoseRate contains both value and unit (e.g. "9 Gram/MT")
        try
        {
            var parts = new[] { record.FDoserate, record.FDosetype };
            record.DoseRate = string.Join(' ', parts.Where(p => !string.IsNullOrWhiteSpace(p))).Trim();
        }
        catch { }

        if (record.CertificateId > 0)
        {
            var existing = await _context.AlpCertificates.Include(c => c.Containers).FirstOrDefaultAsync(c => c.CertificateId == record.CertificateId);
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(record);
                existing.UpdatedDate = DateTime.Now;

                _context.AlpContainers.RemoveRange(existing.Containers);
                existing.Containers = record.Containers ?? new List<AlpContainer>();

                await _context.SaveChangesAsync();
                return existing;
            }
        }

        record.CreatedDate = DateTime.Now;
        record.UpdatedDate = DateTime.Now;
        _context.AlpCertificates.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<List<MbCertificate>> GetAllMbCertificatesAsync()
    {
        return await _context.MbCertificates
            .Include(c => c.Containers)
            .OrderByDescending(c => c.CreatedDate)
            .ToListAsync();
    }

    public async Task<List<AlpCertificate>> GetAllAlpCertificatesAsync()
    {
        return await _context.AlpCertificates
            .Include(c => c.Containers)
            .OrderByDescending(c => c.CreatedDate)
            .ToListAsync();
    }
}