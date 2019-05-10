USE [CARWASH]
GO

/****** Object:  Table [dbo].[ORDERS]    Script Date: 9/05/2019 06:08:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[ORDERS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CORRELATIVO] [numeric](18, 0) NULL,
	[FECHA] [date] NULL,
	[ANIO] [smallint] NULL,
	[MES] [smallint] NULL,
	[DIA] [smallint] NULL,
	[TIPOAUTO] [smallint] NULL,
	[IMPORTE] [float] NULL,
	[NOPLACAS] [varchar](10) NULL,
	[NOMCLIENTE] [varchar](100) NULL,
	[OPCION] [varchar](10) NULL,
	[STATUS] [varchar](2) NULL,
 CONSTRAINT [PK_ORDERS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

