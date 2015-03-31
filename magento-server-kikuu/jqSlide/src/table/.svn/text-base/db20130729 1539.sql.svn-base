-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.0.20-nt-max-log


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema jdxt
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ jdxt;
USE jdxt;

--
-- Table structure for table `jdxt`.`project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `area` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `starttime` varchar(20) NOT NULL,
  `quarter` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `jdxt`.`project`
--

/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` (`id`,`name`,`area`,`state`,`starttime`,`quarter`) VALUES 
 ('20130729151604','第一个任务，是吗','海珠','准备中','2013-07-29','第1季度');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;


--
-- Table structure for table `jdxt`.`user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `username` varchar(11) NOT NULL,
  `password` varchar(11) NOT NULL,
  `id` int(10) unsigned NOT NULL auto_increment,
  `nickname` varchar(45) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `jdxt`.`user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`username`,`password`,`id`,`nickname`) VALUES 
 ('1','1',1,'石总'),
 ('admin','admin',2,'管理员'),
 ('lifeng','123',3,'砺锋科技');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
