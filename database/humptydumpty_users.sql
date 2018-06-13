-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: ironman.crb3zmhwoovo.us-east-1.rds.amazonaws.com    Database: humptydumpty
-- ------------------------------------------------------
-- Server version	5.6.39-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `high_score` int(11) DEFAULT NULL,
  `mode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'scott',48,NULL),(2,'koichi',70,NULL),(3,'lina',78,NULL),(4,'',196,NULL),(5,'test',23,NULL),(6,'Catherine',50,NULL),(7,'ALVIN',30,NULL),(8,'Yoosun',39,NULL),(9,'Karen',40,NULL),(10,'AJ',24,NULL),(11,'MeanDean',38,NULL),(12,'Dean',47,NULL),(13,'not koichi',48,NULL),(14,'ihciok',44,NULL),(15,'Isto',35,NULL),(16,'JOHN',72,NULL),(17,'koichi-mon',49,NULL),(18,'Rose',69,NULL),(19,'JosephPMartin',72,NULL),(20,'John2',58,NULL),(21,'John3',78,NULL),(22,'john-4',69,NULL),(23,'JOHN WHY',62,NULL),(24,'anotherJOHN',76,NULL),(25,'JOHN STOP IT',60,NULL),(26,'just-john',70,NULL),(27,'JUAN',61,NULL),(28,'NobodyCracksEggsLikeThatGif',45,NULL),(29,'john again',65,NULL),(30,'johnjohn',83,NULL),(31,'JUAN CYNN',61,NULL),(32,'only john',87,NULL),(33,'monstar',47,NULL),(34,'LKM',36,NULL),(35,'2chainz',40,NULL),(36,'nick',38,NULL),(37,'Phil',27,NULL),(38,'michael',19,NULL),(39,'Hany',50,NULL),(40,'katie2',79,NULL),(41,'katie',24,NULL),(42,'lina4',83,NULL),(43,'lina5',74,NULL),(44,'lina7',73,NULL),(45,'lina11',88,NULL),(46,'333',19,NULL),(47,'L1na4',89,NULL),(48,'L1na9',73,NULL),(49,'L1na11',83,NULL),(50,'L1na21',94,NULL),(51,'L1na99',96,NULL),(52,'L1na901',66,NULL),(53,'LINA 2000',84,NULL),(54,'lina unknown',85,NULL),(55,'lina unknoWnb',80,NULL),(56,'katei9',120,NULL),(57,'99',19,NULL),(58,'lina_despair',86,NULL),(59,'Peter',25,NULL),(60,'oooh its john',59,NULL),(61,'asdf',26,NULL),(62,'phil1',19,NULL),(63,'phil2',21,NULL),(64,'asdfds',19,NULL),(65,'sadf',19,NULL),(66,'asdfsadf',19,NULL),(67,'adsf',31,NULL),(68,'asdfa',19,NULL),(69,'asdfasd',19,NULL),(70,'phila',19,NULL),(71,'johna',20,NULL),(72,'philb',19,NULL),(73,'asdfasdf',19,NULL),(74,'John Doe',19,NULL),(75,'sad John',83,NULL),(76,'2chainz thug lyfe',130,NULL),(77,'guest',19,NULL),(78,'dan',20,NULL),(79,'jeff',20,NULL),(80,'chuck',19,NULL),(81,'asfasdf',19,NULL),(82,'sam',19,NULL),(83,'alex',20,NULL),(84,'someguy',26,NULL),(85,'Jason',22,NULL),(86,'SMACK',55,NULL),(87,'fdsa',41,NULL),(88,'faaa',42,NULL),(89,'fdsa',41,NULL),(90,'faaa',42,NULL),(91,'four',41,'easy'),(92,'one',43,'easy'),(93,'two',41,'easy'),(94,'three',41,'easy'),(95,'four',41,'easy'),(96,'player 1',19,NULL),(97,'player 2',19,NULL),(98,'P1',19,NULL),(99,'P2',19,NULL),(100,'one',41,'medium'),(101,'one',41,'hard');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-13  8:38:11
