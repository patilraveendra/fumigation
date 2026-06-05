using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class MbContainer
{
    [Key]
    public int ContainerId { get; set; }
    public int CertificateId { get; set; }

    [JsonPropertyName("cont")] public string? ContainerNumber { get; set; }
    [JsonPropertyName("seal")] public string? SealNumber { get; set; }
    public int? Sequence { get; set; }

    [JsonIgnore] public MbCertificate Certificate { get; set; } = null!;
}

public class AlpContainer
{
    [Key]
    public int ContainerId { get; set; }
    public int CertificateId { get; set; }

    [JsonPropertyName("cont")] public string? ContainerNumber { get; set; }
    [JsonPropertyName("seal")] public string? SealNumber { get; set; }
    public int? Sequence { get; set; }

    [JsonIgnore] public AlpCertificate Certificate { get; set; } = null!;
}

public class MbCertificate
{
    [Key]
    public int CertificateId { get; set; }

    public string CertificateType { get; set; } = "MB";
    public string CertificateNumber { get; set; } = string.Empty;

    public DateTime? DateIssued { get; set; }

    public string? ProviderId { get; set; }
    public string? AccreditationNumber { get; set; }

    public string? ClientName { get; set; }
    public string? ClientAddress { get; set; }

    public string? ExporterName { get; set; }
    public string? ExporterAddress { get; set; }

    public string? ConsigneeName { get; set; }
    public string? ConsigneeAddress { get; set; }

    public string? DestinationCountry { get; set; }
    public string? PortOfLoading { get; set; }

    public string? SealNumber { get; set; }
    public string? ShippingMark { get; set; }

    public string? CommodityDescription { get; set; }
    public string? CommodityQuantity { get; set; }
    public string? NetWeight { get; set; }

    public string? PackagingMaterial { get; set; }
    public string? CountryOfOrigin { get; set; }

    public string? FumigantName { get; set; }
    public string? PlaceOfFumigation { get; set; }

    public string? DoseRate { get; set; }
    public string? AppliedDose { get; set; }

    public string? ExposurePeriod { get; set; }
    public string? DurationFumigation { get; set; }

    public string? TemperatureMinAir { get; set; }
    public string? TemperatureType { get; set; }

    public string? Humidity { get; set; }
    public string? FinalTLVReading { get; set; }

    public DateTime? FumigationStarted { get; set; }
    public DateTime? FumigationCompleted { get; set; }

    public string? GasTightSheets { get; set; }

    public string? DeclarationText { get; set; }
    public string? OfficeRemark { get; set; }

    public string? InvoiceNumber { get; set; }
    public DateTime? InvoiceDate { get; set; }

    public string? FumigatorName { get; set; }

    public string? Category { get; set; }
    public string? ContainerNoPlace { get; set; }

    public string? Ct20 { get; set; }
    public string? Ct40 { get; set; }

    // Legacy Fields
    [JsonPropertyName("noOfQuantity")] public string? NoOfQuantity { get; set; }
    [JsonPropertyName("detail")] public string? Detail { get; set; }
    [JsonPropertyName("tc_country")] public string? TcCountry { get; set; }
    [JsonPropertyName("quantityDeclared")] public string? QuantityDeclared { get; set; }
    [JsonPropertyName("marks")] public string? Marks { get; set; }
    [JsonPropertyName("l_ship")] public string? LShip { get; set; }
    [JsonPropertyName("d_name")] public string? DName { get; set; }
    [JsonPropertyName("d_address")] public string? DAddress { get; set; }
    [JsonPropertyName("c_name")] public string? CName { get; set; }
    [JsonPropertyName("c_address")] public string? CAddress { get; set; }
    [JsonPropertyName("notify")] public string? Notify { get; set; }
    [JsonPropertyName("f_type")] public string? FType { get; set; }
    [JsonPropertyName("f_date")] public DateTime? FDate { get; set; }
    [JsonPropertyName("f_place")] public string? FPlace { get; set; }
    [JsonPropertyName("f_doserate")] public string? FDoserate { get; set; }
    [JsonPropertyName("f_dosetype")] public string? FDosetype { get; set; }
    [JsonPropertyName("f_duration")] public string? FDuration { get; set; }
    [JsonPropertyName("f_temperature")] public string? FTemperature { get; set; }
    [JsonPropertyName("f_ttype")] public string? FTtype { get; set; }
    [JsonPropertyName("f_performed")] public string? FPerformed { get; set; }
    [JsonPropertyName("f_airspace")] public string? FAirspace { get; set; }
    [JsonPropertyName("fcoi")] public string? Fcoi { get; set; }
    [JsonPropertyName("phnph")] public string? Phnph { get; set; }
    [JsonPropertyName("declaration")] public string? Declaration { get; set; }
    [JsonPropertyName("oremark")] public string? Oremark { get; set; }
    [JsonPropertyName("invoiceno")] public string? Invoiceno { get; set; }
    [JsonPropertyName("cnoat")] public string? Cnoat { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public DateTime UpdatedDate { get; set; } = DateTime.Now;

    public ICollection<MbContainer> Containers { get; set; }
        = new List<MbContainer>();
}

public class AlpCertificate
{
    [Key]
    public int CertificateId { get; set; }

    public string CertificateType { get; set; } = "ALP";
    public string CertificateNumber { get; set; } = string.Empty;

    public DateTime? DateIssued { get; set; }

    public string? ProviderId { get; set; }
    public string? AccreditationNumber { get; set; }

    public string? ClientName { get; set; }
    public string? ClientAddress { get; set; }

    public string? ExporterName { get; set; }
    public string? ExporterAddress { get; set; }

    public string? ConsigneeName { get; set; }
    public string? ConsigneeAddress { get; set; }

    public string? DestinationCountry { get; set; }
    public string? PortOfLoading { get; set; }

    public string? SealNumber { get; set; }
    public string? ShippingMark { get; set; }

    public string? CommodityDescription { get; set; }
    public string? CommodityQuantity { get; set; }
    public string? NetWeight { get; set; }

    public string? PackagingMaterial { get; set; }
    public string? CountryOfOrigin { get; set; }

    public string? FumigantName { get; set; }
    public string? PlaceOfFumigation { get; set; }

    public string? DoseRate { get; set; }
    public string? AppliedDose { get; set; }

    public string? ExposurePeriod { get; set; }
    public string? DurationFumigation { get; set; }

    public string? DurationDays { get; set; }
    public string? DurationHours { get; set; }

    public string? Humidity { get; set; }
    public string? Temperature { get; set; }

    public DateTime? FumigationStarted { get; set; }
    public DateTime? FumigationCompleted { get; set; }

    public string? GasTightSheets { get; set; }

    public string? DeclarationText { get; set; }
    public string? OfficeRemark { get; set; }

    public string? InvoiceNumber { get; set; }
    public DateTime? InvoiceDate { get; set; }

    public string? FumigatorName { get; set; }

    public string? Category { get; set; }
    public string? ContainerNoPlace { get; set; }

    public string? FumigationCarriedOutIn { get; set; }

    // Legacy Fields
    [JsonPropertyName("noOfQuantity")] public string? NoOfQuantity { get; set; }
    [JsonPropertyName("detail")] public string? Detail { get; set; }
    [JsonPropertyName("tc_country")] public string? TcCountry { get; set; }
    [JsonPropertyName("quantityDeclared")] public string? QuantityDeclared { get; set; }
    [JsonPropertyName("marks")] public string? Marks { get; set; }
    [JsonPropertyName("l_ship")] public string? LShip { get; set; }
    [JsonPropertyName("d_name")] public string? DName { get; set; }
    [JsonPropertyName("d_address")] public string? DAddress { get; set; }
    [JsonPropertyName("c_name")] public string? CName { get; set; }
    [JsonPropertyName("c_address")] public string? CAddress { get; set; }
    [JsonPropertyName("notify")] public string? Notify { get; set; }
    [JsonPropertyName("f_type")] public string? FType { get; set; }
    [JsonPropertyName("f_date")] public DateTime? FDate { get; set; }
    [JsonPropertyName("f_place")] public string? FPlace { get; set; }
    [JsonPropertyName("f_doserate")] public string? FDoserate { get; set; }
    [JsonPropertyName("f_dosetype")] public string? FDosetype { get; set; }
    [JsonPropertyName("f_duration")] public string? FDuration { get; set; }
    [JsonPropertyName("f_hour")] public string? FHour { get; set; }
    [JsonPropertyName("f_temperature")] public string? FTemperature { get; set; }
    [JsonPropertyName("f_ttype")] public string? FTtype { get; set; }
    [JsonPropertyName("f_performed")] public string? FPerformed { get; set; }
    [JsonPropertyName("f_airspace")] public string? FAirspace { get; set; }
    [JsonPropertyName("fcoi")] public string? Fcoi { get; set; }
    [JsonPropertyName("phnph")] public string? Phnph { get; set; }
    [JsonPropertyName("declaration")] public string? Declaration { get; set; }
    [JsonPropertyName("oremark")] public string? Oremark { get; set; }
    [JsonPropertyName("invoiceno")] public string? Invoiceno { get; set; }
    [JsonPropertyName("cnoat")] public string? Cnoat { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public DateTime UpdatedDate { get; set; } = DateTime.Now;

    public ICollection<AlpContainer> Containers { get; set; }
        = new List<AlpContainer>();
}