CREATE DATABASE `learnrdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE learnrdb;

CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(45) NOT NULL,
  `userType` varchar(45) NOT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `school` varchar(100) DEFAULT NULL,
  `interests` varchar(100) DEFAULT NULL,
  `position` varchar(45) DEFAULT NULL,
  `sex` varchar(45) DEFAULT NULL,
  `isAdmin` boolean DEFAULT FALSE,
  PRIMARY KEY (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `relationships` (
  `relationshipID` int NOT NULL AUTO_INCREMENT,
  `mentorEmail` varchar(50) NOT NULL,
  `menteeEmail` varchar(50) NOT NULL,
  PRIMARY KEY (`relationshipID`),
  UNIQUE KEY `mentor_mentee_unique` (`mentorEmail`, `menteeEmail`),
  FOREIGN KEY (`mentorEmail`) REFERENCES `users`(`email`),
  FOREIGN KEY (`menteeEmail`) REFERENCES `users`(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pathways` (
  `pathwayID` int NOT NULL AUTO_INCREMENT,
  `skill` varchar(45) NOT NULL,
  `numberOfSteps` int NOT NULL,
  `pathwayDescription` varchar(500),
  PRIMARY KEY (`pathwayID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `menteepathways` (
  `menteeEmail` varchar(50) NOT NULL,
  `pathwayID` int NOT NULL,
  `step` int NOT NULL,
  PRIMARY KEY (`menteeEmail`,`pathwayID`),
  FOREIGN KEY (`menteeEmail`) REFERENCES `users`(`email`),
  FOREIGN KEY (`pathwayID`) REFERENCES `pathways`(`pathwayID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `badges` (
  `badgeID` int NOT NULL AUTO_INCREMENT,
  `badgeName` varchar(70) NOT NULL,
  `badgeDescription` varchar(200) NOT NULL,
  PRIMARY KEY (`badgeId`, `badgeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `menteebadges` (
  `menteeEmail` varchar(50) NOT NULL,
  `badgeID` int NOT NULL,
  PRIMARY KEY (`menteeEmail`,`badgeID`),
  FOREIGN KEY (`menteeEmail`) REFERENCES `users`(`email`),
  FOREIGN KEY (`badgeID`) REFERENCES `badges`(`badgeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


