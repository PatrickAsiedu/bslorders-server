-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 25, 2022 at 05:03 PM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bslorders`
--

-- --------------------------------------------------------

--
-- Table structure for table `drink`
--

CREATE TABLE `drink` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` varchar(80) DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drink`
--

INSERT INTO `drink` (`id`, `name`, `status`,`created_at`, `updated_at`) VALUES
(4, 'Samea','ACTIVE', '2022-02-21 22:34:08', NULL),
(6, 'Millet Drink','ACTIVE', '2022-02-22 13:00:01', NULL),
(7, 'Samea','ACTIVE', '2022-02-22 13:24:39', NULL),
(13, 'Hausa Koko','ACTIVE', '2022-02-23 16:13:37', NULL),
(15, 'Millet Drink','ACTIVE', '2022-02-23 16:14:53', NULL),
(18, 'Sobolo drink','ACTIVE', '2022-02-25 11:05:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` varchar(80) DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`,`status`, `created_at`, `updated_at`) VALUES
(4, 'Waakye with assorted protein','ACTIVE', '2022-02-22 11:30:41', NULL),
(6, 'Mummies fried Rice', 'ACTIVE','2022-02-22 11:30:41', NULL),
(8, 'Banku with Okra Soup','ACTIVE', '2022-02-22 11:59:18', NULL),
(22, 'Mummies fries','ACTIVE', '2022-02-25 11:04:56', NULL),
(23, 'Curried Rice','ACTIVE', '2022-02-25 11:04:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `menu_date` date DEFAULT NULL,
  `status` varchar(80) DEFAULT 'ACTIVE' ,
  `expires_at` datetime NOT NULL,
  `created_by` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `menu_drink` (
  `menu_id` int(11) NOT NULL,
  `drink_id` int(11) NOT NULL,
  `drink_name` text NOT NULL,
  `created_at` datetime NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





CREATE TABLE `menu_food` (
  `menu_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `food_name` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `food_name` varchar(80) NOT NULL,
  `drink_id` int(11) NOT NULL,
  `drink_name` varchar(80) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

-- INSERT INTO `orders` (`id`, `user_id`, `food_id`, `drink_id`, `comment`, `created_at`) VALUES
-- (1, 28, 3, 3, 'No pepper and sugar', '2022-02-23 14:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `phone_number` text NOT NULL,
  `password` text NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'user',
  `status` varchar(30) NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
