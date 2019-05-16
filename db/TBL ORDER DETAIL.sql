USE [CARWASH]
GO

/****** Object:  Table [dbo].[ORDERS_DETAILS]    Script Date: 16/05/2019 01:40:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[ORDERS_DETAILS](
	[ANIO] [int] NULL,
	[MES] [int] NULL,
	[DIA] [int] NULL,
	[CORRELATIVO] [numeric](18, 0) NULL,
	[CODPROD] [int] NULL,
	[DESCRIPCION] [varchar](200) NULL,
	[IMPORTE] [float] NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_ORDERS_DETAILS] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
