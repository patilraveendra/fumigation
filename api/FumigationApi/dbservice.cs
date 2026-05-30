
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
        record.CreatedDate = DateTime.Now;
        record.UpdatedDate = DateTime.Now;
        _context.MbCertificates.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<AlpCertificate> SaveAlpCertificateAsync(AlpCertificate record)
    {
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