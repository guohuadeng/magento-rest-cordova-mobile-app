create database jdxt;
create table user(
	username varchar(11) not null,
	password varchar(11) not null
)
insert into user values('1','1');
insert into user values('admin','admin');
select * from user;
desc user;
drop table project;
drop table user;
create table project(
id varchar(20) primary key,
name varchar(20) not null,
area varchar(20) not null,
state varchar(20) not null,
starttime varchar(20) not null,
quarter varchar(20) not null
)
select * from project;
delete  from project;
desc project;



 