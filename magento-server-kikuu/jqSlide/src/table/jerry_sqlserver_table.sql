USE [jdxt]
GO
/****** Object:  Table [dbo].[tbl_user]    Script Date: 08/05/2013 22:04:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tbl_user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](11) NOT NULL,
	[password] [varchar](11) NOT NULL,
	[nickname] [varchar](50) NULL,
 CONSTRAINT [PK_tbl_user] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[tbl_user] ON
INSERT [dbo].[tbl_user] ([id], [username], [password], [nickname]) VALUES (1, N'1', N'1', N'石总')
SET IDENTITY_INSERT [dbo].[tbl_user] OFF
/****** Object:  Table [dbo].[project]    Script Date: 08/05/2013 22:04:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[project](
	[id] [varchar](20) NOT NULL,
	[name] [varchar](20) NOT NULL,
	[area] [varchar](20) NOT NULL,
	[state] [varchar](20) NOT NULL,
	[starttime] [varchar](20) NOT NULL,
	[quarter] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[project] ([id], [name], [area], [state], [starttime], [quarter]) VALUES (N'20130801231355', N'singing', N'白云', N'巡查中', N'2011-01-01', N'第3季度')
/****** Object:  Table [dbo].[location]    Script Date: 08/05/2013 22:04:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[location](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[longitude] [varchar](60) NOT NULL,
	[latitude] [varchar](60) NOT NULL,
	[time] [varchar](60) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[location] ON
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (1, N'23.1254501', N'113.3652303', N'2013-08-05 17:21:07')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (2, N'23.125457', N'113.36522', N'2013-08-05 17:31:47')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (3, N'23.125457', N'113.36522', N'2013-08-05 17:32:12')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (4, N'23.125457', N'113.36522', N'2013-08-05 17:32:52')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (5, N'23.125457', N'113.36522', N'2013-08-05 17:32:58')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (6, N'23.125457', N'113.36522', N'2013-08-05 17:33:08')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (7, N'23.125457', N'113.36522', N'2013-08-05 17:33:14')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (8, N'23.1254501', N'113.3652303', N'2013-08-05 17:34:43')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (9, N'23.1254501', N'113.3652303', N'2013-08-05 17:35:27')
INSERT [dbo].[location] ([id], [longitude], [latitude], [time]) VALUES (10, N'23.125644', N'113.365118', N'2013-08-05 19:11:25')
SET IDENTITY_INSERT [dbo].[location] OFF
