insert into tbl_user values('1','1','ЪЏзм');
select * from project;
delete from project;
create table location(
id int identity(1,1) primary key,
longitude varchar(60) not null,
latitude varchar(60) not null,
time varchar(60) not null
)

select * from location;
delete from location;
sp_columns location;
