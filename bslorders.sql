-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql102.epizy.com
-- Generation Time: Feb 15, 2022 at 01:53 AM
-- Server version: 10.3.27-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `epiz_31067379_food_app`
--


CREATE TABLE `drink` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drink`
--

INSERT INTO `drink` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'Millet drink', '2022-02-14 00:00:00', '2022-02-25 11:06:47');


-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`, `created_at`, `updated_at`) VALUES
(3, 'Waakye', '2022-02-05 15:52:09', '2022-02-23 17:06:54');




-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `expires_at` date NOT NULL,
  `menu_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_by` text NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------


-- Create the menu_food junction table
CREATE TABLE `menu_food` (
    `menu_id` INT(11) NOT NULL,
    `food_id` INT(11) NOT NULL,
    `food_name` VARCHAR(255) NOT NULL,
    `created_at` date NOT NULL
);

-- Create the menu_drink junction table
CREATE TABLE `menu_drink` (
    `menu_id` INT(11) NOT NULL,
    `drink_id` INT(11) NOT NULL,
    `drink_name` VARCHAR(255) NOT NULL,
    `created_at` date NOT NULL
);

-- a
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `food_name` VARCHAR(255) NOT NULL,
  `drink_id` int(11) NOT NULL,
  `drink_name` VARCHAR(255) NOT NULL,
  `menu_id` INT NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `phone_number` text NOT NULL,
  `password` text NOT NULL,
  `type` text NOT NULL,
  `status` text NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--
INSERT INTO `users` (`id`, `name`, `phone_number`, `password`, `type`,`status`, `created_at`) VALUES
(1, 'John Mensah', '0500000000', '$2a$12$90MbFBgHvt/HR6Wgx7u51eDNbAh8bZnfCTZD7YJFo61hbqVrlmdUS', 'admin','ACTIVE', '2022-02-21 16:03:02'),
(2, 'Joel the Cheff', '0200000000', '$2a$12$T2SILsCdjJuH1Gf4QJ5LmeVLJsD5/i3o4Z1aVBvPj2S.H7EF02nHS', 'chef','ACTIVE', '2022-02-21 16:03:02');


--
-- Indexes for dumped tables
--

--
-- Indexes for table `drink`
--
ALTER TABLE `drink`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drink`
--
ALTER TABLE `drink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

  

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
