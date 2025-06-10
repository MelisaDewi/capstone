-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2025 at 08:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_garden`
--

-- --------------------------------------------------------

--
-- Table structure for table `actuator_logs`
--

CREATE TABLE `actuator_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actuator_logs`
--

INSERT INTO `actuator_logs` (`id`, `user_id`, `action`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 'Irrigation Pump OFF', 'Success', '2025-06-10 00:17:30', '2025-06-10 00:17:30'),
(3, 1, 'Nutrient Valve Opened', 'Success', '2025-06-10 00:47:30', '2025-06-10 00:47:30'),
(4, 1, 'Water Sensor Calibrated', 'Failure', '2025-06-10 01:07:30', '2025-06-10 01:07:30'),
(6, 1, 'Fan Turned OFF', 'Success', '2025-06-10 02:58:52', '2025-06-10 02:58:52'),
(7, 1, 'Fan Turned OFF', 'Success', '2025-06-10 02:59:06', '2025-06-10 02:59:06'),
(8, 1, 'Fan Turned OFF', 'Success', '2025-06-10 03:05:51', '2025-06-10 03:05:51'),
(9, 1, 'Fan Turned ON', 'Success', '2025-06-10 03:06:02', '2025-06-10 03:06:02'),
(11, 5, 'Water Pump OFF', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(12, 5, 'Light System ON', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(13, 5, 'Light System OFF', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(14, 5, 'Nutrient Valve OPEN', 'Pending', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(15, 5, 'Nutrient Valve CLOSE', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(16, 5, 'Fan ON', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(17, 5, 'Fan OFF', 'Error', '2025-06-10 04:04:09', '2025-06-10 04:04:09'),
(18, 5, 'PH Regulator Inject', 'Success', '2025-06-10 04:04:09', '2025-06-10 04:04:09');

-- --------------------------------------------------------

--
-- Table structure for table `automation_parameters`
--

CREATE TABLE `automation_parameters` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `min_temperature` float NOT NULL,
  `max_temperature` float NOT NULL,
  `min_pH` float NOT NULL,
  `max_pH` float NOT NULL,
  `min_TDS` float NOT NULL,
  `max_TDS` float NOT NULL,
  `min_water_level` float NOT NULL,
  `max_water_level` float NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `automation_parameters`
--

INSERT INTO `automation_parameters` (`id`, `user_id`, `min_temperature`, `max_temperature`, `min_pH`, `max_pH`, `min_TDS`, `max_TDS`, `min_water_level`, `max_water_level`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 12, 1, 234, 1, 23, 2, 23, '2025-06-10 00:59:39', '2025-06-10 01:02:13'),
(5, 5, 1, 12, 1, 8, 1, 12, 5, 10, '2025-06-10 03:47:21', '2025-06-10 05:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `garden_logs`
--

CREATE TABLE `garden_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `temperature` float NOT NULL,
  `water_level` float NOT NULL,
  `pH` float NOT NULL,
  `TDS` float NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `garden_logs`
--

INSERT INTO `garden_logs` (`id`, `user_id`, `temperature`, `water_level`, `pH`, `TDS`, `created_at`, `updated_at`) VALUES
(3, 1, 28.9, 21.2, 6.9, 710, '2025-06-09 13:08:18', '2025-06-09 13:08:18'),
(4, 1, 27.4, 22.1, 7, 705, '2025-06-09 01:08:18', '2025-06-09 01:08:18'),
(5, 1, 28, 20, 6.5, 695, '2025-06-08 01:08:18', '2025-06-08 01:08:18'),
(6, 1, 28.2, 23.3, 6.6, 690, '2025-06-07 01:08:18', '2025-06-07 01:08:18'),
(7, 1, 28.7, 19.7, 6.8, 675, '2025-06-06 01:08:18', '2025-06-06 01:08:18'),
(8, 1, 29, 24, 6.9, 715, '2025-06-05 01:08:18', '2025-06-05 01:08:18'),
(9, 1, 27.9, 18.9, 6.6, 700, '2025-06-04 01:08:18', '2025-06-04 01:08:18'),
(10, 1, 28.3, 25.2, 6.7, 690, '2025-06-03 01:08:18', '2025-06-03 01:08:18'),
(11, 1, 28.4, 21.5, 6.8, 705, '2025-06-02 01:08:18', '2025-06-02 01:08:18'),
(12, 1, 3, 3, 3, 3, '2025-06-10 02:47:44', '2025-06-10 02:47:44'),
(13, 1, 34, 34, 34, 34, '2025-06-10 02:57:30', '2025-06-10 02:57:30'),
(14, 1, 20, 200, 200, 20, '2025-06-10 03:07:14', '2025-06-10 03:07:14'),
(15, 5, 3, 2, 12, 32, '2025-06-10 03:36:39', '2025-06-10 03:36:39'),
(22, 5, 25, 74.6, 6.7, 940, '2025-06-10 03:53:41', '2025-06-10 03:53:41'),
(23, 5, 23.8, 76, 6.9, 960, '2025-06-10 03:53:41', '2025-06-10 03:53:41'),
(24, 5, 24.2, 74.9, 7, 955, '2025-06-10 03:53:41', '2025-06-10 03:53:41'),
(25, 5, 25.3, 75.5, 6.6, 945, '2025-06-10 03:53:41', '2025-06-10 03:53:41'),
(26, 5, 200, 200, 200, 200, '2025-06-10 04:29:33', '2025-06-10 04:29:33');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance`
--

INSERT INTO `maintenance` (`id`, `user_id`, `activity`, `created_at`, `updated_at`) VALUES
(1, 1, 'Cleaned water pump', '2025-06-07 01:41:46', '2025-06-07 01:41:46'),
(2, 1, 'Checked TDS sensor calibration test', '2025-06-08 01:41:46', '2025-06-10 02:28:55'),
(3, 1, 'Replaced pH sensor', '2025-06-09 01:41:46', '2025-06-09 01:41:46'),
(4, 1, 'Flushed nutrient delivery lines', '2025-06-09 20:41:46', '2025-06-09 20:41:46'),
(6, 1, 'test', '2025-06-10 01:49:48', '2025-06-10 01:49:48'),
(7, 1, 'testing the edit note', '2025-06-10 01:51:30', '2025-06-10 02:29:14'),
(8, 1, 'test', '2025-06-10 04:26:06', '2025-06-10 04:26:06'),
(9, 1, 'testing', '2025-06-10 04:26:15', '2025-06-10 04:26:15'),
(11, 5, 'testing', '2025-06-10 04:27:38', '2025-06-10 04:27:38'),
(12, 5, 'testing 3erad', '2025-06-10 04:27:42', '2025-06-10 04:28:49'),
(14, 5, 'aegfsd', '2025-06-10 04:34:46', '2025-06-10 04:34:50'),
(15, 5, 'teestkng', '2025-06-10 05:29:58', '2025-06-10 05:29:58');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `created_at`, `updated_at`) VALUES
(7, 1, 'Pump Activated', 'The irrigation pump was automatically activated due to low soil moisture.', '2025-06-10 00:35:29', '2025-06-10 00:35:29'),
(8, 1, 'Temperature Alert', 'The temperature has exceeded the optimal range for your crops.', '2025-06-08 01:35:29', '2025-06-08 01:35:29'),
(9, 1, 'System Restarted', 'Your system was restarted successfully at 3:00 AM.', '2025-06-09 22:35:29', '2025-06-09 22:35:29'),
(10, 1, 'Nutrient Level High', 'The nutrient level in your hydroponic system is too high. Please dilute the solution.', '2025-06-09 21:35:29', '2025-06-09 21:35:29'),
(11, 1, 'temperature Alert', 'temperature = 20 is out of range (1 - 12)', '2025-06-10 03:06:31', '2025-06-10 03:06:31'),
(13, 5, 'Water Level Alert', 'Water level dropped below the minimum threshold.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(14, 5, 'Temperature Spike', 'Temperature exceeded safe operating range.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(15, 5, 'pH Level Warning', 'pH value is out of the acceptable range.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(16, 5, 'TDS Alert', 'TDS level is unusually high, check nutrient mix.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(17, 5, 'Sensor Sync', 'All sensors synchronized successfully.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(18, 5, 'Automation Triggered', 'Automated watering system has been activated.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(19, 5, 'Maintenance Reminder', 'It’s time to clean the water reservoir.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(20, 5, 'Manual Override', 'Manual override was used to adjust lighting.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(21, 5, 'Firmware Update', 'Firmware update applied successfully.', '2025-06-10 04:22:29', '2025-06-10 04:22:29'),
(23, 5, 'TDS Alert', 'TDS = 200 is out of range (1 - 12)', '2025-06-10 04:29:11', '2025-06-10 04:29:11'),
(24, 5, 'temperature Alert', 'temperature = 200 is out of range (1 - 12)', '2025-06-10 04:29:24', '2025-06-10 04:29:24'),
(25, 5, 'water_level Alert', 'water_level = 200 is out of range (1 - 123)', '2025-06-10 04:29:29', '2025-06-10 04:29:29'),
(26, 5, 'pH Alert', 'pH = 200 is out of range (1 - 12)', '2025-06-10 04:29:33', '2025-06-10 04:29:33');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `mqtt_broker` varchar(255) NOT NULL,
  `topic_pH` varchar(255) NOT NULL,
  `topic_ultrasonik` varchar(255) NOT NULL,
  `topic_humidity` varchar(255) NOT NULL,
  `topic_TDS` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `mqtt_broker`, `topic_pH`, `topic_ultrasonik`, `topic_humidity`, `topic_TDS`, `created_at`, `updated_at`) VALUES
(1, 'broker', 'topic/pHtest', 'topic/ultrasonic', 'topic/humiditytest', 'topic/TDS', '2025-06-10 00:59:11', '2025-06-10 02:35:00'),
(2, 'broker', 'topic/pH2', 'topic/ultrasonic2', 'topic/humidity2', 'topic/TDS2', '2025-06-10 03:30:58', '2025-06-10 03:30:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 'user', 'password', 1, '2025-06-10 00:59:32', '2025-06-10 00:59:32'),
(5, 'user2', '$2b$10$hCvIE1mno6C/l4Z3JrEOieRpg0RQ31TS52bBTqEFrD9W0z0TNYYda', 2, '2025-06-10 03:31:50', '2025-06-10 03:31:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actuator_logs`
--
ALTER TABLE `actuator_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `automation_parameters`
--
ALTER TABLE `automation_parameters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_id` (`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `garden_logs`
--
ALTER TABLE `garden_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actuator_logs`
--
ALTER TABLE `actuator_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `automation_parameters`
--
ALTER TABLE `automation_parameters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `garden_logs`
--
ALTER TABLE `garden_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actuator_logs`
--
ALTER TABLE `actuator_logs`
  ADD CONSTRAINT `actuator_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `automation_parameters`
--
ALTER TABLE `automation_parameters`
  ADD CONSTRAINT `automation_parameters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `garden_logs`
--
ALTER TABLE `garden_logs`
  ADD CONSTRAINT `garden_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
