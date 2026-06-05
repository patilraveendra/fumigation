using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<MbCertificate> MbCertificates { get; set; }
    public DbSet<MbContainer> MbContainers { get; set; }
    public DbSet<AlpCertificate> AlpCertificates { get; set; }
    public DbSet<AlpContainer> AlpContainers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MbCertificate>().ToTable("MB_Certificates");
        modelBuilder.Entity<MbContainer>().ToTable("MB_Containers");
        modelBuilder.Entity<AlpCertificate>().ToTable("ALP_Certificates");
        modelBuilder.Entity<AlpContainer>().ToTable("ALP_Containers");

        modelBuilder.Entity<MbContainer>()
            .HasOne(c => c.Certificate)
            .WithMany(m => m.Containers)
            .HasForeignKey(c => c.CertificateId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AlpContainer>()
            .HasOne(c => c.Certificate)
            .WithMany(a => a.Containers)
            .HasForeignKey(c => c.CertificateId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
