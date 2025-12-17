-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2025 at 10:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nyabugogo_parking`
--

-- --------------------------------------------------------

--
-- Table structure for table `parkingrecord`
--

CREATE TABLE `parkingrecord` (
  `recordId` int(11) NOT NULL,
  `entryTime` datetime NOT NULL,
  `exitTime` datetime DEFAULT NULL,
  `totalHours` decimal(10,2) DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `vehicleId` int(11) NOT NULL,
  `recordedBy` int(11) NOT NULL,
  `status` enum('Active','Completed') DEFAULT 'Active',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parkingrecord`
--

INSERT INTO `parkingrecord` (`recordId`, `entryTime`, `exitTime`, `totalHours`, `totalAmount`, `vehicleId`, `recordedBy`, `status`, `createdAt`) VALUES
(1, '2025-12-17 12:24:20', '2025-12-17 12:30:07', 0.10, 1500.00, 1, 2, 'Completed', '2025-12-17 09:24:20'),
(2, '2025-12-17 12:27:51', NULL, NULL, NULL, 2, 2, 'Active', '2025-12-17 09:27:51'),
(3, '2025-12-17 12:28:07', NULL, NULL, NULL, 3, 2, 'Active', '2025-12-17 09:28:07');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ParkingManager','Driver') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `fullname`, `phone`, `password`, `role`, `createdAt`) VALUES
(2, 'Admin Manager', '0788000000', '$2a$10$ue9nRs86wVlXzwm.RIhkoeNXQlCZ3hyKJbw0WW4NrurDz65bWo6yu', 'ParkingManager', '2025-12-17 09:14:33'),
(3, 'Jean Claude Mugisha', '0788111111', '$2a$10$VT3wyZwlNW7AKqt3E1V2Me0FIlkIoSpaxHGdQinW0IH2yoj5maKKy', 'Driver', '2025-12-17 09:15:29');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

  CREATE TABLE `vehicle` (
    `vehicleId` int(11) NOT NULL,
    `plateNumber` varchar(20) NOT NULL,
    `vehicleType` enum('Car','Motorcycle','Bus','Truck') NOT NULL,
    `userId` int(11) NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`vehicleId`, `plateNumber`, `vehicleType`, `userId`, `createdAt`) VALUES
(1, 'RAD 123A', 'Car', 2, '2025-12-17 09:24:20'),
(2, 'RAD 423A', 'Motorcycle', 2, '2025-12-17 09:27:51'),
(3, 'RAD-SJD2', 'Truck', 2, '2025-12-17 09:28:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `parkingrecord`
--
ALTER TABLE `parkingrecord`
  ADD PRIMARY KEY (`recordId`),
  ADD KEY `vehicleId` (`vehicleId`),
  ADD KEY `recordedBy` (`recordedBy`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicleId`),
  ADD UNIQUE KEY `plateNumber` (`plateNumber`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `parkingrecord`
--
ALTER TABLE `parkingrecord`
  MODIFY `recordId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `parkingrecord`
--
ALTER TABLE `parkingrecord`
  ADD CONSTRAINT `parkingrecord_ibfk_1` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle` (`vehicleId`) ON DELETE CASCADE,
  ADD CONSTRAINT `parkingrecord_ibfk_2` FOREIGN KEY (`recordedBy`) REFERENCES `user` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
