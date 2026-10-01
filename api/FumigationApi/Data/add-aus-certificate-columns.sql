IF COL_LENGTH('dbo.AUS_Certificates', 'workOrder') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD workOrder NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'other') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD other NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'consignmentLink') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD consignmentLink NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'placeAddress') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD placeAddress NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'placeCity') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD placeCity NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'placeCountry') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD placeCountry NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'placePostcode') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD placePostcode NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'targetCommodity') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD targetCommodity BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'targetContainer') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD targetContainer BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'targetPacking') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD targetPacking BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_starttime') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_starttime NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_endtime') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_endtime NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_date_completed') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_date_completed NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_time') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_time NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_doserate2') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_doserate2 NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_dosetype2') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_dosetype2 NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_duration2') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_duration2 NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'f_temperature2') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD f_temperature2 NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'fcd1') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD fcd1 BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'fcd2') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD fcd2 BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'fcd3') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD fcd3 BIT NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'fcd4') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD fcd4 NVARCHAR(MAX) NULL;

IF COL_LENGTH('dbo.AUS_Certificates', 'ventilation') IS NULL
    ALTER TABLE dbo.AUS_Certificates ADD ventilation NVARCHAR(MAX) NULL;
