-- =============================================
-- MB (METHYL BROMIDE) CERTIFICATE TABLE
-- =============================================

CREATE TABLE MB_Certificates
(
    -- Primary Key
    CertificateID INT PRIMARY KEY IDENTITY(1,1),

    -- Certificate Info
    CertificateType VARCHAR(10) NOT NULL DEFAULT 'MB',
    CertificateNumber VARCHAR(100) NOT NULL UNIQUE,
    DateIssued DATE,
    ProviderID VARCHAR(100),
    AccreditationNumber VARCHAR(100),

    -- Client Information
    ClientName VARCHAR(255),
    ClientAddress VARCHAR(500),

    -- Exporter/Shipper Details
    ExporterName VARCHAR(255),
    ExporterAddress VARCHAR(500),
    ConsigneeName VARCHAR(255),
    ConsigneeAddress VARCHAR(500),

    -- Shipment Details
    DestinationCountry VARCHAR(100),
    PortOfLoading VARCHAR(100),
    SealNumber VARCHAR(100),
    ShippingMark VARCHAR(255),

    -- Commodity Information
    CommodityDescription TEXT,
    CommodityQuantity VARCHAR(100),
    NetWeight VARCHAR(100),
    PackagingMaterial VARCHAR(255),
    CountryOfOrigin VARCHAR(100),

    -- Fumigation Details
    FumigantName VARCHAR(100),
    PlaceOfFumigation VARCHAR(255),
    DoseRate VARCHAR(100),
    AppliedDose VARCHAR(100),
    ExposurePeriod VARCHAR(100),
    DurationFumigation VARCHAR(100),
    TemperatureMinAir VARCHAR(100),
    TemperatureType VARCHAR(100),
    Humidity VARCHAR(100),
    FinalTLVReading VARCHAR(100),
    FumigationStarted DATETIME,
    FumigationCompleted DATETIME,
    GasTightSheets VARCHAR(10),

    -- Declaration & Remarks
    DeclarationText TEXT,
    OfficeRemark TEXT,

    -- Invoice Details
    InvoiceNumber VARCHAR(100),
    InvoiceDate DATE,

    -- Operator Details
    FumigatorName VARCHAR(255),

    -- Additional MB Fields
    Category VARCHAR(50),
    -- Phyto / Non-Phyto
    ContainerNoPlace VARCHAR(100),
    -- CNOAT field
    Cnoat VARCHAR(100),
    Ct20 VARCHAR(100),
    Ct40 VARCHAR(100),

    -- Legacy Fields
    NoOfQuantity VARCHAR(100),
    Detail VARCHAR(255),
    TcCountry VARCHAR(100),
    QuantityDeclared VARCHAR(100),
    Marks TEXT,
    LShip VARCHAR(255),
    DName VARCHAR(255),
    DAddress VARCHAR(500),
    CName VARCHAR(255),
    CAddress VARCHAR(500),
    Notify VARCHAR(255),
    FType VARCHAR(100),
    FDate DATE,
    FPlace VARCHAR(255),
    FDoserate VARCHAR(100),
    FDosetype VARCHAR(100),
    FDuration VARCHAR(100),
    FTemperature VARCHAR(100),
    FTtype VARCHAR(100),
    FPerformed VARCHAR(10),
    FAirspace VARCHAR(100),
    Fcoi VARCHAR(255),
    Phnph VARCHAR(50),
    Declaration TEXT,
    Oremark TEXT,
    Invoiceno VARCHAR(100),

    -- Metadata
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),

    INDEX IX_CertificateNumber (CertificateNumber),
    INDEX IX_DateIssued (DateIssued),
    INDEX IX_ExporterName (ExporterName)
);

-- =============================================
-- MB CONTAINERS JUNCTION TABLE
-- =============================================

CREATE TABLE MB_Containers
(
    ContainerID INT PRIMARY KEY IDENTITY(1,1),
    CertificateID INT NOT NULL,
    ContainerNumber VARCHAR(100),
    SealNumber VARCHAR(100),
    Sequence INT,

    FOREIGN KEY (CertificateID) REFERENCES MB_Certificates(CertificateID) ON DELETE CASCADE,
    INDEX IX_CertificateID (CertificateID)
);

-- =============================================
-- ALP (ALUMINUM PHOSPHIDE) CERTIFICATE TABLE
-- =============================================

CREATE TABLE ALP_Certificates
(
    -- Primary Key
    CertificateID INT PRIMARY KEY IDENTITY(1,1),

    -- Certificate Info
    CertificateType VARCHAR(10) NOT NULL DEFAULT 'ALP',
    CertificateNumber VARCHAR(100) NOT NULL UNIQUE,
    DateIssued DATE,
    ProviderID VARCHAR(100),
    AccreditationNumber VARCHAR(100),

    -- Client Information
    ClientName VARCHAR(255),
    ClientAddress VARCHAR(500),

    -- Exporter/Shipper Details
    ExporterName VARCHAR(255),
    ExporterAddress VARCHAR(500),
    ConsigneeName VARCHAR(255),
    ConsigneeAddress VARCHAR(500),

    -- Shipment Details
    DestinationCountry VARCHAR(100),
    PortOfLoading VARCHAR(100),
    SealNumber VARCHAR(100),
    ShippingMark VARCHAR(255),

    -- Commodity Information
    CommodityDescription TEXT,
    CommodityQuantity VARCHAR(100),
    NetWeight VARCHAR(100),
    PackagingMaterial VARCHAR(255),
    CountryOfOrigin VARCHAR(100),

    -- Fumigation Details (ALP Specific)
    FumigantName VARCHAR(100),
    PlaceOfFumigation VARCHAR(255),
    DoseRate VARCHAR(100),
    AppliedDose VARCHAR(100),
    ExposurePeriod VARCHAR(100),
    DurationFumigation VARCHAR(100),
    DurationDays VARCHAR(100),
    DurationHours VARCHAR(100),
    Humidity VARCHAR(100),
    Temperature VARCHAR(100),
    FumigationStarted DATETIME,
    FumigationCompleted DATETIME,
    GasTightSheets VARCHAR(10),

    -- Declaration & Remarks
    DeclarationText TEXT,
    OfficeRemark TEXT,

    -- Invoice Details
    InvoiceNumber VARCHAR(100),
    InvoiceDate DATE,

    -- Operator Details
    FumigatorName VARCHAR(255),

    -- Additional ALP Fields
    Category VARCHAR(50),
    -- Phyto / Non-Phyto
    ContainerNoPlace VARCHAR(100),
    -- CNOAT field (As Per Format / In Additional Declaration)
    Cnoat VARCHAR(100),
    FumigationCarriedOutIn VARCHAR(255),
    -- NSPM/ISPM regulation

    -- Legacy Fields
    NoOfQuantity VARCHAR(100),
    Detail VARCHAR(255),
    TcCountry VARCHAR(100),
    QuantityDeclared VARCHAR(100),
    Marks TEXT,
    LShip VARCHAR(255),
    DName VARCHAR(255),
    DAddress VARCHAR(500),
    CName VARCHAR(255),
    CAddress VARCHAR(500),
    Notify VARCHAR(255),
    FType VARCHAR(100),
    FDate DATE,
    FPlace VARCHAR(255),
    FDoserate VARCHAR(100),
    FDosetype VARCHAR(100),
    FDuration VARCHAR(100),
    FHour VARCHAR(100),
    FTemperature VARCHAR(100),
    FTtype VARCHAR(100),
    FPerformed VARCHAR(10),
    FAirspace VARCHAR(100),
    Fcoi VARCHAR(255),
    Phnph VARCHAR(50),
    Declaration TEXT,
    Oremark TEXT,
    Invoiceno VARCHAR(100),

    -- Metadata
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),

    INDEX IX_CertificateNumber (CertificateNumber),
    INDEX IX_DateIssued (DateIssued),
    INDEX IX_ExporterName (ExporterName)
);

-- =============================================
-- ALP CONTAINERS JUNCTION TABLE
-- =============================================

CREATE TABLE ALP_Containers
(
    ContainerID INT PRIMARY KEY IDENTITY(1,1),
    CertificateID INT NOT NULL,
    ContainerNumber VARCHAR(100),
    SealNumber VARCHAR(100),
    Sequence INT,

    FOREIGN KEY (CertificateID) REFERENCES ALP_Certificates(CertificateID) ON DELETE CASCADE,
    INDEX IX_CertificateID (CertificateID)
);
