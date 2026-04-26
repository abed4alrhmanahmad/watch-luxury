-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2026 at 02:13 AM
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
-- Database: `chronolux_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_user`
--

CREATE TABLE `accounts_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(128) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `is_superuser` tinyint(1) NOT NULL DEFAULT 0,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts_user`
--

INSERT INTO `accounts_user` (`id`, `email`, `first_name`, `last_name`, `phone`, `password`, `is_active`, `is_staff`, `is_superuser`, `last_login`, `created_at`, `updated_at`) VALUES
(1, '32230379@students.liu.edu.lb', 'abed', 'ahmad', '', 'pbkdf2_sha256$720000$8ZyOR5P1dT0LyObO8z1yFw$iZSv1OoinJreXxH8aE8Nqz+nKKymbQKsQVNRKhYwoWM=', 1, 0, 0, NULL, '2026-04-24 12:40:30', '2026-04-24 12:40:30'),
(2, 'admin@chronolux.com', 'Admin', 'ChronoLux', '', 'pbkdf2_sha256$720000$n6VTG0Y8mS4A2UtOYz1c3K$2Fp2qYUTQsZxGQepoUuk9GlNd+N0xKgNU8mqrBz7HL0=', 1, 1, 1, '2026-04-25 16:51:40', '2026-04-24 12:40:45', '2026-04-25 19:51:40'),
(3, 'abed@gmail.com', 'abed', 'abed22', '', 'pbkdf2_sha256$720000$vw8pQVH68OPpeYDQllQc9W$M9ABI0JH1Beqsmyeq9CSXCdkUYM11MFONU+mmLc3nsw=', 1, 1, 0, '2026-04-24 21:05:18', '2026-04-24 20:49:48', '2026-04-25 00:05:18'),
(4, 'test1@example.com', 'John', 'Doe', '1234567890', 'pbkdf2_sha256$720000$B3gkqtdqJY89ciRzzDVeWW$fqr899akPm5SlDZQ3mUOmyt9qbu8M9zR64LeH4lRZa0=', 1, 0, 0, NULL, '2026-04-25 16:23:29', '2026-04-25 16:23:29'),
(5, 'test@example.com', 'John Doe', 'John', '', 'pbkdf2_sha256$720000$9wdQsUZL2uDkANIJ59Yle1$eg1jksAqFaZqsGEYsmFc9ShJRQ9YPMrLVL2hjODJMrQ=', 1, 1, 0, '2026-04-25 16:51:10', '2026-04-25 16:48:59', '2026-04-25 19:51:10');

-- --------------------------------------------------------

--
-- Table structure for table `accounts_user_groups`
--

CREATE TABLE `accounts_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_user_user_permissions`
--

CREATE TABLE `accounts_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_user_user_permissions`
--

INSERT INTO `accounts_user_user_permissions` (`id`, `user_id`, `permission_id`) VALUES
(1, 3, 21),
(2, 3, 22),
(3, 3, 23),
(4, 5, 21);

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_user'),
(22, 'Can change user', 6, 'change_user'),
(23, 'Can delete user', 6, 'delete_user'),
(24, 'Can view user', 6, 'view_user'),
(25, 'Can add category', 7, 'add_category'),
(26, 'Can change category', 7, 'change_category'),
(27, 'Can delete category', 7, 'delete_category'),
(28, 'Can view category', 7, 'view_category'),
(29, 'Can add product', 8, 'add_product'),
(30, 'Can change product', 8, 'change_product'),
(31, 'Can delete product', 8, 'delete_product'),
(32, 'Can view product', 8, 'view_product'),
(33, 'Can add product image', 9, 'add_productimage'),
(34, 'Can change product image', 9, 'change_productimage'),
(35, 'Can delete product image', 9, 'delete_productimage'),
(36, 'Can view product image', 9, 'view_productimage'),
(37, 'Can add cart', 10, 'add_cart'),
(38, 'Can change cart', 10, 'change_cart'),
(39, 'Can delete cart', 10, 'delete_cart'),
(40, 'Can view cart', 10, 'view_cart'),
(41, 'Can add cart item', 11, 'add_cartitem'),
(42, 'Can change cart item', 11, 'change_cartitem'),
(43, 'Can delete cart item', 11, 'delete_cartitem'),
(44, 'Can view cart item', 11, 'view_cartitem'),
(45, 'Can add address', 12, 'add_address'),
(46, 'Can change address', 12, 'change_address'),
(47, 'Can delete address', 12, 'delete_address'),
(48, 'Can view address', 12, 'view_address'),
(49, 'Can add order', 13, 'add_order'),
(50, 'Can change order', 13, 'change_order'),
(51, 'Can delete order', 13, 'delete_order'),
(52, 'Can view order', 13, 'view_order'),
(53, 'Can add order item', 14, 'add_orderitem'),
(54, 'Can change order item', 14, 'change_orderitem'),
(55, 'Can delete order item', 14, 'delete_orderitem'),
(56, 'Can view order item', 14, 'view_orderitem'),
(57, 'Can add contact message', 15, 'add_contactmessage'),
(58, 'Can change contact message', 15, 'change_contactmessage'),
(59, 'Can delete contact message', 15, 'delete_contactmessage'),
(60, 'Can view contact message', 15, 'view_contactmessage'),
(61, 'Can add review', 16, 'add_review'),
(62, 'Can change review', 16, 'change_review'),
(63, 'Can delete review', 16, 'delete_review'),
(64, 'Can view review', 16, 'view_review'),
(65, 'Can add wishlist item', 17, 'add_wishlistitem'),
(66, 'Can change wishlist item', 17, 'change_wishlistitem'),
(67, 'Can delete wishlist item', 17, 'delete_wishlistitem'),
(68, 'Can view wishlist item', 17, 'view_wishlistitem'),
(69, 'Can add coupon', 18, 'add_coupon'),
(70, 'Can change coupon', 18, 'change_coupon'),
(71, 'Can delete coupon', 18, 'delete_coupon'),
(72, 'Can view coupon', 18, 'view_coupon');

-- --------------------------------------------------------

--
-- Table structure for table `cart_cart`
--

CREATE TABLE `cart_cart` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_cart`
--

INSERT INTO `cart_cart` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 2, '2026-04-24 20:24:54', '2026-04-24 20:24:54'),
(2, 4, '2026-04-25 16:32:48', '2026-04-25 16:32:48');

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_message`
--

CREATE TABLE `contact_message` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_message`
--

INSERT INTO `contact_message` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`) VALUES
(1, 'Test', 'test@test.com', 'Hello', 'Test message', 0, '2026-04-24 12:38:27'),
(2, 'asas', '32230379@students.liu.edu.lb', 'as', 'dwd', 0, '2026-04-24 12:42:40'),
(3, 'ashaksahakshkas', '79@students.liu.edu.lb', 'asa', 'sdsdsd', 0, '2026-04-24 20:43:52'),
(4, 'John Doe', 'john@example.com', 'Need help', 'Please call me back.', 0, '2026-04-25 16:42:14');

-- --------------------------------------------------------

--
-- Table structure for table `coupons_coupon`
--

CREATE TABLE `coupons_coupon` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `expiry_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons_coupon`
--

INSERT INTO `coupons_coupon` (`id`, `code`, `discount_percentage`, `is_active`, `expiry_date`, `created_at`) VALUES
(1, 'SAVE10', 10, 1, '2027-04-25', '2026-04-25 11:37:07.736172'),
(2, 'LUXURY20', 20, 1, '2027-04-25', '2026-04-25 11:37:07.739918'),
(3, 'EXPIRED', 15, 1, '2026-04-26', '2026-04-25 11:37:07.742383'),
(4, 'abod', 30, 1, '2026-04-26', '2026-04-25 15:04:50.518356');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
(1, '2026-04-24 20:46:46.210313', '9', 'sososafah', 1, '[{\"added\": {}}, {\"added\": {\"name\": \"product image\", \"object\": \"sososafah - image 0\"}}]', 8, 2),
(2, '2026-04-24 20:47:49.200697', '9', 'sososafah', 3, '', 8, 2),
(3, '2026-04-24 20:49:48.469435', '3', 'abed@gmail.com', 1, '[{\"added\": {}}]', 6, 2),
(4, '2026-04-24 20:52:18.190511', '3', 'abed@gmail.com', 2, '[{\"changed\": {\"fields\": [\"Is staff\"]}}]', 6, 2),
(5, '2026-04-24 21:04:30.277886', '3', 'abed@gmail.com', 2, '[]', 6, 2),
(6, '2026-04-24 21:05:10.399654', '3', 'abed@gmail.com', 2, '[{\"changed\": {\"fields\": [\"User permissions\"]}}]', 6, 2),
(7, '2026-04-24 21:25:16.668443', '5', 'yamazbne', 1, '[{\"added\": {}}]', 7, 2),
(8, '2026-04-24 21:25:53.816650', '5', 'yamazbne', 2, '[]', 7, 2),
(9, '2026-04-24 21:27:57.091332', '10', 'pic', 1, '[{\"added\": {}}, {\"added\": {\"name\": \"product image\", \"object\": \"pic - image 1\"}}, {\"added\": {\"name\": \"product image\", \"object\": \"pic - image 0\"}}]', 8, 2),
(10, '2026-04-24 21:29:38.495939', '10', 'pic', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"pic - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"pic - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(11, '2026-04-24 21:30:35.021243', '10', 'pic', 2, '[{\"changed\": {\"fields\": [\"Original price\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"pic - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"pic - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(12, '2026-04-24 21:31:15.289487', '10', 'pic', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"pic - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(13, '2026-04-24 21:52:19.792726', '2', 'Order #137226 — admin@chronolux.com', 2, '[{\"changed\": {\"fields\": [\"Status\"]}}]', 13, 2),
(14, '2026-04-24 21:56:02.439070', '2', 'Order #137226 — admin@chronolux.com', 2, '[{\"changed\": {\"fields\": [\"Status\"]}}]', 13, 2),
(15, '2026-04-24 22:36:16.889635', '1', 'admin@chronolux.com → Chronograph Black (5/5)', 2, '[{\"changed\": {\"fields\": [\"Comment\"]}}]', 16, 2),
(16, '2026-04-25 12:10:41.396557', '3', 'EXPIRED — 15% off', 2, '[{\"changed\": {\"fields\": [\"Expiry date\"]}}]', 18, 2),
(17, '2026-04-25 12:10:49.826716', '3', 'EXPIRED — 15% off', 2, '[{\"changed\": {\"fields\": [\"Expiry date\"]}}]', 18, 2),
(18, '2026-04-25 12:10:56.373333', '3', 'EXPIRED — 15% off', 2, '[{\"changed\": {\"fields\": [\"Expiry date\"]}}]', 18, 2),
(19, '2026-04-25 12:44:47.100177', '5', 'yamazbne', 3, '', 7, 2),
(20, '2026-04-25 15:04:50.519335', '4', 'abod — 30% off', 1, '[{\"added\": {}}]', 18, 2),
(21, '2026-04-25 15:51:39.963711', '6', 'wow', 1, '[{\"added\": {}}]', 7, 2),
(22, '2026-04-25 15:52:00.864670', '6', 'wow', 3, '', 7, 2),
(23, '2026-04-25 16:51:04.193190', '5', 'test@example.com', 2, '[{\"changed\": {\"fields\": [\"User permissions\"]}}]', 6, 2),
(24, '2026-04-25 21:52:01.251445', '4', 'accessories for man', 2, '[{\"changed\": {\"fields\": [\"Name\", \"Image url\"]}}]', 7, 2),
(25, '2026-04-25 21:53:23.550442', '4', 'accessories for man', 2, '[{\"changed\": {\"fields\": [\"Image url\"]}}]', 7, 2),
(26, '2026-04-25 21:55:18.531302', '7', 'accessories for women', 1, '[{\"added\": {}}]', 7, 2),
(27, '2026-04-25 21:56:27.605370', '3', 'Jewelry', 3, '', 7, 2),
(28, '2026-04-25 22:04:08.496187', '111', 'KPE453', 1, '[{\"added\": {}}, {\"added\": {\"name\": \"product image\", \"object\": \"KPE453 - image 0\"}}]', 8, 2),
(29, '2026-04-25 22:05:17.371114', '111', 'KPE453', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"KPE453 - image 0\", \"fields\": [\"Image url\"]}}]', 8, 2),
(30, '2026-04-25 22:06:21.956871', '111', 'KPE453', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"KPE453 - image 0\", \"fields\": [\"Image url\"]}}]', 8, 2),
(31, '2026-04-25 22:07:31.497520', '111', 'Ring', 2, '[{\"changed\": {\"fields\": [\"Name\", \"Description\"]}}]', 8, 2),
(32, '2026-04-25 22:23:02.917975', '18', 'Bold Pilot', 3, '', 8, 2),
(33, '2026-04-25 22:23:02.920977', '12', 'Bold Pilot', 3, '', 8, 2),
(34, '2026-04-25 22:23:03.001761', '28', 'Casual Dress', 3, '', 8, 2),
(35, '2026-04-25 22:23:03.010741', '27', 'Casual Dress', 3, '', 8, 2),
(36, '2026-04-25 22:23:03.019713', '22', 'Casual Dress', 3, '', 8, 2),
(37, '2026-04-25 22:23:03.026686', '46', 'Charming Sapphire', 3, '', 8, 2),
(38, '2026-04-25 22:23:03.027684', '3', 'Chronograph Black', 3, '', 8, 2),
(39, '2026-04-25 22:23:03.030687', '17', 'Classic Automatic', 3, '', 8, 2),
(40, '2026-04-25 22:23:03.041657', '1', 'Classic Brown Leather', 3, '', 8, 2),
(41, '2026-04-25 22:23:03.051619', '40', 'Crystal Heritage', 3, '', 8, 2),
(42, '2026-04-25 22:23:03.065607', '39', 'Crystal Heritage', 3, '', 8, 2),
(43, '2026-04-25 22:23:03.071590', '48', 'Delicate Lady', 3, '', 8, 2),
(44, '2026-04-25 22:23:03.075567', '85', 'Designer Sunglasses', 3, '', 8, 2),
(45, '2026-04-25 22:23:03.082545', '7', 'Diamond Bezel Elite', 3, '', 8, 2),
(46, '2026-04-25 22:23:03.087532', '90', 'Elegant Bag', 3, '', 8, 2),
(47, '2026-04-25 22:23:03.113461', '89', 'Elegant Bag', 3, '', 8, 2),
(48, '2026-04-25 22:23:03.121442', '36', 'Elegant Romance', 3, '', 8, 2),
(49, '2026-04-25 22:23:03.127415', '4', 'Elegant Silver Gold', 3, '', 8, 2),
(50, '2026-04-25 22:23:03.128412', '73', 'Exclusive Hat', 3, '', 8, 2),
(51, '2026-04-25 22:23:03.130650', '24', 'Executive Diver', 3, '', 8, 2),
(52, '2026-04-25 22:23:03.132183', '31', 'Feminine Classic', 3, '', 8, 2),
(53, '2026-04-25 22:23:03.133832', '34', 'Gold Collection', 3, '', 8, 2),
(54, '2026-04-25 22:23:03.135564', '2', 'Gold Luxury Watch', 3, '', 8, 2),
(55, '2026-04-25 22:23:03.137452', '82', 'Leather Set', 3, '', 8, 2),
(56, '2026-04-25 22:23:03.139865', '74', 'Leather Set', 3, '', 8, 2),
(57, '2026-04-25 22:23:03.146498', '81', 'Limited Gloves', 3, '', 8, 2),
(58, '2026-04-25 22:23:03.149314', '76', 'Limited Gloves', 3, '', 8, 2),
(59, '2026-04-25 22:23:03.155491', '72', 'Limited Gloves', 3, '', 8, 2),
(60, '2026-04-25 22:23:03.158881', '33', 'Luxurious Beauty', 3, '', 8, 2),
(61, '2026-04-25 22:23:03.160639', '25', 'Mesh Model', 3, '', 8, 2),
(62, '2026-04-25 22:23:03.162293', '5', 'Minimal Black Mesh', 3, '', 8, 2),
(63, '2026-04-25 22:23:03.164260', '15', 'Minimalist Aviator', 3, '', 8, 2),
(64, '2026-04-25 22:23:03.166496', '26', 'Modern Quartz', 3, '', 8, 2),
(65, '2026-04-25 22:23:03.168354', '37', 'Pearl Series', 3, '', 8, 2),
(66, '2026-04-25 22:23:03.170639', '87', 'Premium Belt', 3, '', 8, 2),
(67, '2026-04-25 22:23:03.172314', '29', 'Premium GMT', 3, '', 8, 2),
(68, '2026-04-25 22:23:03.174127', '13', 'Premium GMT', 3, '', 8, 2),
(69, '2026-04-25 22:23:03.176438', '111', 'Ring', 3, '', 8, 2),
(70, '2026-04-25 22:23:03.178868', '6', 'Rose Gold Luxury', 3, '', 8, 2),
(71, '2026-04-25 22:23:03.180954', '45', 'Rose Ruby', 3, '', 8, 2),
(72, '2026-04-25 22:23:03.183546', '44', 'Rose Ruby', 3, '', 8, 2),
(73, '2026-04-25 22:23:03.185836', '43', 'Rose Ruby', 3, '', 8, 2),
(74, '2026-04-25 22:23:03.188111', '79', 'Satin Exclusive', 3, '', 8, 2),
(75, '2026-04-25 22:23:03.190600', '78', 'Satin Exclusive', 3, '', 8, 2),
(76, '2026-04-25 22:23:03.192792', '71', 'Satin Exclusive', 3, '', 8, 2),
(77, '2026-04-25 22:23:03.195097', '88', 'Silk Series', 3, '', 8, 2),
(78, '2026-04-25 22:23:03.197128', '49', 'Silver Edition', 3, '', 8, 2),
(79, '2026-04-25 22:23:03.199364', '47', 'Silver Edition', 3, '', 8, 2),
(80, '2026-04-25 22:23:03.201407', '23', 'Sophisticated Explorer', 3, '', 8, 2),
(81, '2026-04-25 22:23:03.204059', '38', 'Sophisticated Premium', 3, '', 8, 2),
(82, '2026-04-25 22:23:03.206229', '32', 'Sophisticated Premium', 3, '', 8, 2),
(83, '2026-04-25 22:23:03.209024', '83', 'Special Collection', 3, '', 8, 2),
(84, '2026-04-25 22:23:03.211157', '20', 'Sport Professional', 3, '', 8, 2),
(85, '2026-04-25 22:23:03.213227', '8', 'Sport Titanium Pro', 3, '', 8, 2),
(86, '2026-04-25 22:23:03.215441', '30', 'Steel Edition', 3, '', 8, 2),
(87, '2026-04-25 22:23:03.222491', '19', 'Steel Edition', 3, '', 8, 2),
(88, '2026-04-25 22:23:03.226380', '14', 'Steel Edition', 3, '', 8, 2),
(89, '2026-04-25 22:23:03.233300', '50', 'Stunning Crown', 3, '', 8, 2),
(90, '2026-04-25 22:23:03.243768', '41', 'Stunning Crown', 3, '', 8, 2),
(91, '2026-04-25 22:23:03.247148', '35', 'Stunning Crown', 3, '', 8, 2),
(92, '2026-04-25 22:23:03.249393', '86', 'Stylish Pocket Square', 3, '', 8, 2),
(93, '2026-04-25 22:23:03.251485', '75', 'Stylish Pocket Square', 3, '', 8, 2),
(94, '2026-04-25 22:23:03.253883', '80', 'Suede Classic', 3, '', 8, 2),
(95, '2026-04-25 22:23:03.256529', '77', 'Suede Classic', 3, '', 8, 2),
(96, '2026-04-25 22:23:03.259035', '42', 'Timeless Model', 3, '', 8, 2),
(97, '2026-04-25 22:23:03.261592', '16', 'Titanium Watch', 3, '', 8, 2),
(98, '2026-04-25 22:23:03.264045', '84', 'Velvet Designer', 3, '', 8, 2),
(99, '2026-04-25 22:23:03.266672', '21', 'Vintage Heritage', 3, '', 8, 2),
(100, '2026-04-25 22:23:03.269290', '11', 'Vintage Heritage', 3, '', 8, 2),
(101, '2026-04-25 23:12:44.188506', '132', 'Full-Grain Leather Wallet', 3, '', 8, 2),
(102, '2026-04-25 23:17:15.195082', '117', 'Sport Chronograph Pro', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Sport Chronograph Pro - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(103, '2026-04-25 23:18:41.801246', '117', 'Sport Chronograph Pro', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Sport Chronograph Pro - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(104, '2026-04-25 23:22:38.838929', '118', 'Sapphire Crystal Automatic', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Sapphire Crystal Automatic - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Sapphire Crystal Automatic - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(105, '2026-04-25 23:24:33.708588', '119', 'Military Field Watch', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Military Field Watch - image 0\", \"fields\": [\"Image url\"]}}, {\"deleted\": {\"name\": \"product image\", \"object\": \"Military Field Watch - image 1\"}}]', 8, 2),
(106, '2026-04-25 23:25:48.736286', '120', 'Moonphase Complication', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Moonphase Complication - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Moonphase Complication - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(107, '2026-04-25 23:26:55.580820', '120', 'Moonphase Complication', 3, '', 8, 2),
(108, '2026-04-25 23:27:32.221063', '121', 'Titanium Solar Edition', 3, '', 8, 2),
(109, '2026-04-25 23:28:30.373580', '133', 'Italian Leather Belt', 3, '', 8, 2),
(110, '2026-04-25 23:29:57.807658', '134', 'Polarized Aviator Sunglasses', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(111, '2026-04-25 23:30:33.585959', '134', 'Polarized Aviator Sunglasses', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 0\", \"fields\": [\"Image url\"]}}]', 8, 2),
(112, '2026-04-25 23:32:10.794274', '134', 'Polarized Aviator Sunglasses', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(113, '2026-04-25 23:33:33.706208', '134', 'Polarized Aviator Sunglasses', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Polarized Aviator Sunglasses - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(114, '2026-04-25 23:34:28.261868', '135', 'Hand-Finished Silk Tie', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Hand-Finished Silk Tie - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Hand-Finished Silk Tie - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(115, '2026-04-25 23:34:49.429481', '135', 'Hand-Finished Silk Tie', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Hand-Finished Silk Tie - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(116, '2026-04-25 23:36:06.817494', '136', 'Full-Grain Messenger Bag', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Full-Grain Messenger Bag - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Full-Grain Messenger Bag - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(117, '2026-04-25 23:36:35.817180', '136', 'Full-Grain Messenger Bag', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Full-Grain Messenger Bag - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(118, '2026-04-25 23:38:08.972817', '137', 'Sterling Silver Cufflinks', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Sterling Silver Cufflinks - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Sterling Silver Cufflinks - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(119, '2026-04-25 23:39:34.620747', '138', 'Pure Cashmere Scarf', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Pure Cashmere Scarf - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Pure Cashmere Scarf - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(120, '2026-04-25 23:40:51.805153', '139', 'Ultra-Slim Card Holder', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Ultra-Slim Card Holder - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Ultra-Slim Card Holder - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(121, '2026-04-25 23:41:45.868314', '140', 'Titanium Money Clip', 3, '', 8, 2),
(122, '2026-04-25 23:42:42.201501', '141', 'Canvas Weekend Duffel Bag', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Canvas Weekend Duffel Bag - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Canvas Weekend Duffel Bag - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(123, '2026-04-25 23:44:52.563444', '142', 'Silk Evening Scarf', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Silk Evening Scarf - image 0\", \"fields\": [\"Image url\"]}}, {\"deleted\": {\"name\": \"product image\", \"object\": \"Silk Evening Scarf - image 1\"}}]', 8, 2),
(124, '2026-04-25 23:46:50.959403', '144', 'Freshwater Pearl Necklace', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Freshwater Pearl Necklace - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(125, '2026-04-25 23:47:58.663106', '145', 'Stackable Gold Bangle Set', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Stackable Gold Bangle Set - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Stackable Gold Bangle Set - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(126, '2026-04-25 23:49:19.413275', '146', 'Pebbled Leather Crossbody', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Pebbled Leather Crossbody - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Pebbled Leather Crossbody - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(127, '2026-04-25 23:50:15.147584', '147', 'Crystal Hair Pin Set', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(128, '2026-04-25 23:51:09.009384', '147', 'Crystal Hair Pin Set', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(129, '2026-04-25 23:52:16.282737', '147', 'Crystal Hair Pin Set', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Crystal Hair Pin Set - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(130, '2026-04-25 23:52:46.806800', '148', 'CZ Diamond Stud Earrings', 3, '', 8, 2),
(131, '2026-04-25 23:54:27.701358', '149', 'Suede Envelope Clutch', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Suede Envelope Clutch - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Suede Envelope Clutch - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(132, '2026-04-25 23:55:23.628681', '150', 'Rose Gold Charm Bracelet', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Rose Gold Charm Bracelet - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Rose Gold Charm Bracelet - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(133, '2026-04-25 23:56:30.719103', '151', 'Velvet Mini Coin Purse', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Velvet Mini Coin Purse - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Velvet Mini Coin Purse - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(134, '2026-04-25 23:57:42.006395', '122', 'Rose Gold Diamond Dial', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Rose Gold Diamond Dial - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Rose Gold Diamond Dial - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(135, '2026-04-25 23:58:30.456276', '123', 'Pearl White Elegance', 3, '', 8, 2),
(136, '2026-04-25 23:59:27.942902', '124', 'Crystal Glamour Automatic', 3, '', 8, 2),
(137, '2026-04-26 00:00:27.810820', '125', 'Gold Bracelet Quartz', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Gold Bracelet Quartz - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Gold Bracelet Quartz - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(138, '2026-04-26 00:01:25.673731', '126', 'Dainty Mesh Minimalist', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Dainty Mesh Minimalist - image 0\", \"fields\": [\"Image url\"]}}, {\"changed\": {\"name\": \"product image\", \"object\": \"Dainty Mesh Minimalist - image 1\", \"fields\": [\"Image url\"]}}]', 8, 2),
(139, '2026-04-26 00:02:12.375931', '127', 'Sapphire Blue Romance', 3, '', 8, 2),
(140, '2026-04-26 00:03:15.671950', '128', 'Diamond Bezel Luxury', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Diamond Bezel Luxury - image 0\", \"fields\": [\"Image url\"]}}, {\"deleted\": {\"name\": \"product image\", \"object\": \"Diamond Bezel Luxury - image 1\"}}]', 8, 2),
(141, '2026-04-26 00:04:02.131791', '129', 'Floral Rose Gold Charm', 3, '', 8, 2),
(142, '2026-04-26 00:05:17.118489', '130', 'Silver Mesh Bracelet Classic', 2, '[{\"changed\": {\"name\": \"product image\", \"object\": \"Silver Mesh Bracelet Classic - image 0\", \"fields\": [\"Image url\"]}}, {\"deleted\": {\"name\": \"product image\", \"object\": \"Silver Mesh Bracelet Classic - image 1\"}}]', 8, 2),
(143, '2026-04-26 00:06:06.217948', '131', 'Moonstone Mystique', 3, '', 8, 2);

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(6, 'accounts', 'user'),
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(10, 'cart', 'cart'),
(11, 'cart', 'cartitem'),
(15, 'contact', 'contactmessage'),
(4, 'contenttypes', 'contenttype'),
(18, 'coupons', 'coupon'),
(12, 'orders', 'address'),
(13, 'orders', 'order'),
(14, 'orders', 'orderitem'),
(5, 'sessions', 'session'),
(7, 'store', 'category'),
(8, 'store', 'product'),
(9, 'store', 'productimage'),
(16, 'store', 'review'),
(17, 'wishlist', 'wishlistitem');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-04-24 12:36:09.963998'),
(2, 'contenttypes', '0002_remove_content_type_name', '2026-04-24 12:36:09.968379'),
(3, 'auth', '0001_initial', '2026-04-24 12:36:09.972372'),
(4, 'auth', '0002_alter_permission_name_max_length', '2026-04-24 12:36:09.978354'),
(5, 'auth', '0003_alter_user_email_max_length', '2026-04-24 12:36:09.987081'),
(6, 'auth', '0004_alter_user_username_opts', '2026-04-24 12:36:09.991173'),
(7, 'auth', '0005_alter_user_last_login_null', '2026-04-24 12:36:09.995057'),
(8, 'auth', '0006_require_contenttypes_0002', '2026-04-24 12:36:09.998059'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2026-04-24 12:36:10.000053'),
(10, 'auth', '0008_alter_user_username_max_length', '2026-04-24 12:36:10.004043'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2026-04-24 12:36:10.008008'),
(12, 'auth', '0010_alter_group_name_max_length', '2026-04-24 12:36:10.011782'),
(13, 'auth', '0011_update_proxy_permissions', '2026-04-24 12:36:10.015756'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2026-04-24 12:36:10.020047'),
(15, 'accounts', '0001_initial', '2026-04-24 12:36:10.023207'),
(16, 'admin', '0001_initial', '2026-04-24 12:36:10.027528'),
(17, 'admin', '0002_logentry_remove_auto_add', '2026-04-24 12:36:10.032352'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2026-04-24 12:36:10.036934'),
(19, 'store', '0001_initial', '2026-04-24 12:36:10.040597'),
(20, 'cart', '0001_initial', '2026-04-24 12:36:10.045022'),
(21, 'contact', '0001_initial', '2026-04-24 12:36:10.051863'),
(22, 'orders', '0001_initial', '2026-04-24 12:36:10.056311'),
(23, 'sessions', '0001_initial', '2026-04-24 12:36:10.060769'),
(24, 'orders', '0002_alter_order_status', '2026-04-24 20:11:46.329390'),
(25, 'store', '0002_add_review_model', '2026-04-24 22:03:02.534857'),
(26, 'wishlist', '0001_initial', '2026-04-24 22:49:58.570458'),
(27, 'coupons', '0001_initial', '2026-04-25 11:36:16.789657');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('6suidvqujgd1iclutzk3c869eq6vyxj0', '.eJxVjMsOwiAQRf-FtSFAebp07zeQgRmkaiAp7cr479qkC93ec859sQjbWuM2aIkzsjNT7PS7JcgPajvAO7Rb57m3dZkT3xV-0MGvHel5Ody_gwqjfmtJxSnMBbwLRmEpzhoSSYtSCIxJOqH0CQRNKjuX0esMNgSLMBkZULH3BxDGOM4:1wGgEG:cDdfpioxTdZ5uLb79oKfFJXc3sVY5rCO9PiA0z3ADzc', '2026-05-09 16:51:40.721063'),
('waq428xeywhtzphydr1x8mb13o5i5y5t', '.eJxVjMsOwiAQRf-FtSFAebp07zeQgRmkaiAp7cr479qkC93ec859sQjbWuM2aIkzsjNT7PS7JcgPajvAO7Rb57m3dZkT3xV-0MGvHel5Ody_gwqjfmtJxSnMBbwLRmEpzhoSSYtSCIxJOqH0CQRNKjuX0esMNgSLMBkZULH3BxDGOM4:1wGO0V:G0dacd5xgX83l_RMBE2ps7su-dkVW2rK6yWPVZvUtUA', '2026-05-08 21:24:15.516653');

-- --------------------------------------------------------

--
-- Table structure for table `orders_address`
--

CREATE TABLE `orders_address` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'United States',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders_order`
--

CREATE TABLE `orders_order` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `order_number` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `shipping_full_name` varchar(100) NOT NULL,
  `shipping_email` varchar(254) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_state` varchar(100) NOT NULL,
  `shipping_zip` varchar(20) NOT NULL,
  `shipping_country` varchar(100) NOT NULL DEFAULT 'United States',
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders_order`
--

INSERT INTO `orders_order` (`id`, `user_id`, `order_number`, `status`, `shipping_full_name`, `shipping_email`, `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_state`, `shipping_zip`, `shipping_country`, `subtotal`, `shipping_cost`, `tax`, `total`, `created_at`, `updated_at`) VALUES
(1, 2, '#823459', 'pending', 'Admin ChronoLux', 'admin@chronolux.com', 'asaas', 'asas', 'as', '2323', '1212', 'Lebanon', 599.00, 0.00, 59.90, 658.90, '2026-04-24 12:55:40', '2026-04-24 12:55:40'),
(2, 2, '#137226', 'delivered', 'Admin ChronoLux', 'admin@chronolux.com', '811215475', '2451kjk', 'sidad', 'le', 'khk', 'Lebanon', 299.00, 0.00, 29.90, 328.90, '2026-04-24 21:49:58', '2026-04-24 21:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `orders_order_item`
--

CREATE TABLE `orders_order_item` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_image` varchar(500) NOT NULL DEFAULT '',
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders_order_item`
--

INSERT INTO `orders_order_item` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `unit_price`, `quantity`) VALUES
(1, 1, NULL, 'Gold Luxury Watch', 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop', 599.00, 1),
(2, 2, NULL, 'Classic Brown Leather', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop', 299.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_category`
--

CREATE TABLE `store_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `image_url` varchar(500) NOT NULL DEFAULT '',
  `image` varchar(200) NOT NULL DEFAULT '',
  `description` text NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store_category`
--

INSERT INTO `store_category` (`id`, `name`, `slug`, `image_url`, `image`, `description`, `created_at`) VALUES
(1, 'Men Watches', 'men-watches', 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop', '', '', '2026-04-24 15:05:50'),
(2, 'Women Watches', 'women-watches', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', '', '', '2026-04-24 15:05:50'),
(4, 'accessories for man', 'accessories', 'https://i0.wp.com/garoboyadjian.com/wp-content/uploads/2024/11/GM22-2-scaled.jpg?resize=800%2C1052&ssl=1', '', '', '2026-04-24 15:05:50'),
(7, 'accessories for women', 'accessories-for-women', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRltuH8XgejgsHxmW07_Axmn3tRxeoikxITFHZCiDvcoR6Fv456klhbdO1oZCYNZlWRHCCRrVA3GrpqFkDz6kttoBPr5fqZe9lA1We3f64iIl_YAu5NR6SN9QLH06vtngOIYJuibzo_&usqp=CAc', '', '', '2026-04-25 21:55:18');

-- --------------------------------------------------------

--
-- Table structure for table `store_product`
--

CREATE TABLE `store_product` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `stock_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store_product`
--

INSERT INTO `store_product` (`id`, `name`, `category_id`, `brand`, `description`, `price`, `original_price`, `stock_count`, `is_active`, `is_featured`, `is_new`, `created_at`, `updated_at`) VALUES
(112, 'Chronograph Black Steel', 1, 'ChronoLux', 'Precision-engineered chronograph with a sleek black dial and stainless steel bracelet. Features 100m water resistance and sapphire crystal glass.', 599.00, 749.00, 15, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(113, 'Automatic Diver Pro', 1, 'Tempus', 'Professional diving watch with automatic movement and 200m water resistance. Bold luminescent markers ensure visibility in any condition.', 849.00, NULL, 8, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(114, 'GMT Master Explorer', 1, 'Heritage', 'Dual-timezone GMT watch with a rotating bezel. Perfect for the international traveler who demands both style and precision.', 999.00, 1199.00, 5, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(115, 'Classic Slim Dress Watch', 1, 'Elegance', 'Timeless dress watch with a slim profile and genuine brown leather strap. Swiss quartz movement ensures perfect accuracy for formal occasions.', 449.00, NULL, 20, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(116, 'Minimalist Steel Quartz', 1, 'Novum', 'Clean lines and a minimalist design define this modern quartz watch. The brushed stainless steel case and white dial pair with any outfit.', 299.00, 349.00, 25, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(117, 'Sport Chronograph Pro', 1, 'Precision', 'High-performance sport chronograph with tachymeter bezel and silicone strap. Built to withstand the demands of an active lifestyle.', 649.00, NULL, 12, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:18:41'),
(118, 'Sapphire Crystal Automatic', 1, 'Luxora', 'Automatic movement visible through an exhibition caseback. The sapphire crystal dial and gold-tone hands exude understated luxury.', 899.00, 1099.00, 7, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-25 23:22:38'),
(119, 'Military Field Watch', 1, 'Heritage', 'Rugged field watch with a canvas NATO strap and scratch-resistant mineral crystal. Inspired by classic military timepieces with modern reliability.', 349.00, NULL, 30, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:24:33'),
(122, 'Rose Gold Diamond Dial', 2, 'Sapphire', 'Stunning rose gold timepiece with a diamond-set bezel and mother-of-pearl dial. Crafted from 316L stainless steel with premium rose gold PVD coating.', 899.00, 1099.00, 6, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-25 23:57:41'),
(125, 'Gold Bracelet Quartz', 2, 'Elegance', 'Sophisticated gold-tone bracelet watch with a rich champagne sunray dial. Transitions effortlessly from office meetings to evening events.', 449.00, NULL, 22, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-26 00:00:27'),
(126, 'Dainty Mesh Minimalist', 2, 'Luxora', 'Petite steel case with an ultra-thin profile and five-row mesh bracelet. The clean white dial and leaf-shaped hands offer a sleek modern aesthetic.', 299.00, 349.00, 35, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-26 00:01:25'),
(128, 'Diamond Bezel Luxury', 2, 'Diamond', 'Opulent ladies watch with a full pavé diamond bezel and mother-of-pearl dial. A statement timepiece worthy of the most extraordinary occasions.', 1199.00, 1399.00, 4, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-26 00:03:15'),
(130, 'Silver Mesh Bracelet Classic', 2, 'Jewel', 'Timeless silver mesh bracelet watch with a polished round case and white dial with Roman numerals. Understated elegance for every day.', 349.00, 399.00, 20, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-26 00:05:17'),
(134, 'Polarized Aviator Sunglasses', 4, 'Designer', 'Polarized UV400 sunglasses with an acetate frame and stainless steel spring hinges. Classic aviator styling in a lightweight, durable design.', 199.00, NULL, 20, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-25 23:33:33'),
(135, 'Hand-Finished Silk Tie', 4, 'Signature', 'Hand-finished 100% silk tie with a classic diagonal stripe pattern. Comes in a premium gift box — ideal for corporate gifting or special occasions.', 79.00, NULL, 50, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:34:49'),
(136, 'Full-Grain Messenger Bag', 4, 'Exclusive', 'Full-grain leather messenger bag with laptop sleeve and organizer pockets. The adjustable strap and solid brass hardware ensure decades of lasting quality.', 299.00, 379.00, 12, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-25 23:36:35'),
(137, 'Sterling Silver Cufflinks', 4, 'ChronoLux', 'Hand-polished sterling silver cufflinks with a classic knot design. Presented in a luxury suede pouch — the ideal gift for any formal occasion.', 129.00, NULL, 25, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-25 23:38:08'),
(138, 'Pure Cashmere Scarf', 4, 'Premium', 'Pure cashmere scarf in rich heathered tones. Incredibly soft and insulating, this versatile piece elevates any autumn or winter ensemble.', 179.00, 219.00, 18, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:39:34'),
(139, 'Ultra-Slim Card Holder', 4, 'Style', 'Ultra-slim full-grain cowhide card holder with 4 slots and a central cash pocket. The leather develops a beautiful natural patina over time.', 69.00, NULL, 45, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:40:51'),
(141, 'Canvas Weekend Duffel Bag', 4, 'Exclusive', 'Spacious waxed canvas and leather duffel with shoe compartment and padded strap. Perfect for weekend getaways, gym sessions, and overnight travel.', 249.00, NULL, 10, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-25 23:42:42'),
(142, 'Silk Evening Scarf', 7, 'Luxora', 'Luxurious 100% pure silk scarf with a hand-rolled hem and vibrant floral print. Wear it as a scarf, headband, or handbag accent — versatile and chic.', 149.00, 189.00, 25, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:44:52'),
(143, 'Structured Italian Handbag', 7, 'Exclusive', 'Impeccably crafted structured handbag in premium Italian leather. Gold-tone hardware, interior organizer pockets, and a removable shoulder strap included.', 399.00, NULL, 8, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-26 02:11:24'),
(144, 'Freshwater Pearl Necklace', 7, 'Pearl', 'Strand of AA-grade freshwater cultured pearls with a sterling silver box clasp. A timeless classic that complements every neckline, day or evening.', 249.00, 299.00, 15, 1, 1, 0, '2026-04-26 02:11:24', '2026-04-25 23:46:50'),
(145, 'Stackable Gold Bangle Set', 7, 'Diamond', 'Set of 5 stackable 18K gold-plated bangles in varying widths. Mix and match freely to create a personalized arm stack that catches the light beautifully.', 189.00, NULL, 30, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-25 23:47:58'),
(146, 'Pebbled Leather Crossbody', 7, 'Style', 'Pebbled calfskin crossbody with a top zip closure and adjustable chain strap. Compact yet spacious — holds phone, keys, cards, and everyday essentials.', 279.00, 329.00, 12, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:49:19'),
(147, 'Crystal Hair Pin Set', 7, 'Jewel', 'Set of 6 Swarovski crystal bobby pins and barrettes in mixed silver and gold tones. Adds a touch of instant glamour to any hairstyle or occasion.', 89.00, NULL, 40, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:52:16'),
(149, 'Suede Envelope Clutch', 7, 'Premium', 'Elegant suede envelope clutch with a gold turn-lock closure. Lined interior with card slot and detachable wrist strap for hands-free convenience.', 169.00, NULL, 14, 1, 0, 1, '2026-04-26 02:11:24', '2026-04-25 23:54:27'),
(150, 'Rose Gold Charm Bracelet', 7, 'Rose Gold', 'Delicate rose gold-plated charm bracelet featuring 7 themed charms: heart, star, key, moon, butterfly, flower, and lock. A gift for every occasion.', 159.00, 199.00, 22, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:55:23'),
(151, 'Velvet Mini Coin Purse', 7, 'Signature', 'Plush velvet coin purse with a gold-tone zip and tassel accent. Perfectly sized for coins, cards, and lip balm — the ideal compact evening companion.', 69.00, NULL, 35, 1, 0, 0, '2026-04-26 02:11:24', '2026-04-25 23:56:30');

-- --------------------------------------------------------

--
-- Table structure for table `store_product_image`
--

CREATE TABLE `store_product_image` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `image_url` varchar(500) NOT NULL DEFAULT '',
  `image` varchar(200) NOT NULL DEFAULT '',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store_product_image`
--

INSERT INTO `store_product_image` (`id`, `product_id`, `image_url`, `image`, `is_primary`, `order`) VALUES
(217, 112, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop', '', 1, 0),
(218, 112, 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&h=600&fit=crop', '', 0, 1),
(219, 113, 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop', '', 1, 0),
(220, 113, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&h=600&fit=crop', '', 0, 1),
(221, 114, 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=600&fit=crop', '', 1, 0),
(222, 114, 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop', '', 0, 1),
(223, 115, 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop', '', 1, 0),
(224, 115, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop', '', 0, 1),
(225, 116, 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=600&fit=crop', '', 1, 0),
(226, 116, 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&h=600&fit=crop', '', 0, 1),
(227, 117, 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=600&h=600&fit=crop', '', 1, 0),
(228, 117, 'https://www.google.com/imgres?q=Sport%20Chronograph%20Pro&imgurl=https%3A%2F%2Fcms.gphg.org%2Fuploads%2Fgphg2023_Endurance_Pro_001_9fe58efdb6.jpg&imgrefurl=https%3A%2F%2Fwww.gphg.org%2Fen%2Fwatches%2F', '', 0, 1),
(229, 118, 'https://images.unsplash.com/photo-1642034195783-ec0001229b85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2FwcGhpcmUlMjBDcnlzdGFsJTIwQXV0b21hdGljfGVufDB8fDB8fHww', '', 1, 0),
(230, 118, 'https://images.unsplash.com/photo-1771195918282-0e10290351a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2FwcGhpcmUlMjBDcnlzdGFsJTIwQXV0b21hdGljfGVufDB8fDB8fHww', '', 0, 1),
(231, 119, 'https://media.istockphoto.com/id/2081243793/photo/generic-military-green-field-watch-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=tB1JS3MeMz9-ODqGOqMpUJCtQQyTz-9QCS7oTGL42g0=', '', 1, 0),
(237, 122, 'https://plus.unsplash.com/premium_photo-1728012217493-b0bfdc0c389a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9zZSUyMEdvbGQlMjBEaWFtb25kJTIwRGlhbHxlbnwwfHwwfHx8M', '', 1, 0),
(238, 122, 'https://images.unsplash.com/photo-1567438022171-636f2f86b971?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um9zZSUyMEdvbGQlMjBEaWFtb25kJTIwRGlhbHxlbnwwfHwwfHx8MA%3D%3', '', 0, 1),
(243, 125, 'https://images.unsplash.com/photo-1708006257965-b571a67d2a63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R29sZCUyMEJyYWNlbGV0JTIwUXVhcnR6fGVufDB8fDB8fHww', '', 1, 0),
(244, 125, 'https://images.unsplash.com/photo-1638471649011-342a0f809762?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEdvbGQlMjBCcmFjZWxldCUyMFF1YXJ0enxlbnwwfHwwfHx8MA%3D%3D', '', 0, 1),
(245, 126, 'https://images.unsplash.com/photo-1760532467646-b9e466403862?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGFpbnR5JTIwTWVzaCUyME1pbmltYWxpc3R8ZW58MHx8MHx8fDA%3D', '', 1, 0),
(246, 126, 'https://images.unsplash.com/photo-1639160696944-dd4c6f79ff9d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fERhaW50eSUyME1lc2glMjBNaW5pbWFsaXN0fGVufDB8fDB8fHww', '', 0, 1),
(249, 128, 'https://images.unsplash.com/photo-1621179106364-f68b7452dafc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RGlhbW9uZCUyMEJlemVsJTIwTHV4dXJ5fGVufDB8fDB8fHww', '', 1, 0),
(253, 130, 'https://images.unsplash.com/photo-1680690485637-252fa89389ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFNpbHZlciUyME1lc2glMjBCcmFjZWxldCUyMENsYXNzaWN8ZW58MHx8MHx', '', 1, 0),
(261, 134, 'https://images.unsplash.com/photo-1752127971664-419f0e5f67ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UG9sYXJpemVkJTIwQXZpYXRvciUyMFN1bmdsYXNzZXN8ZW58MHx8MHx8fDA', '', 1, 0),
(262, 134, 'https://images.unsplash.com/photo-1650850288292-0d96e1568993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8UG9sYXJpemVkJTIwQXZpYXRvciUyMFN1bmdsYXNzZXN8ZW58MHx8MHx8fDA', '', 0, 1),
(263, 135, 'https://plus.unsplash.com/premium_photo-1728043643421-cf69737a3e3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8SGFuZC1GaW5pc2hlZCUyMFNpbGslMjBUaWV8ZW58MHx8MHx8fDA%3', '', 1, 0),
(264, 135, 'https://media.istockphoto.com/id/537187465/photo/businessman-tie-clothing.webp?a=1&b=1&s=612x612&w=0&k=20&c=gRjOVWUkJ4OHOQP8DiylRAWdnX8Y6NGkMvhmmRS3JTA=', '', 0, 1),
(265, 136, 'https://media.istockphoto.com/id/470629986/photo/leather-bag.webp?a=1&b=1&s=612x612&w=0&k=20&c=igBZDLnMgj6uhQsB7AupIByW-7CDsSKYfbiDItSF6Lo=', '', 1, 0),
(266, 136, 'https://media.istockphoto.com/id/530731891/photo/brown-leather-bag.webp?a=1&b=1&s=612x612&w=0&k=20&c=Cov_jw3pnOQrjRI1GygAY0IFyZ6UYwSb4anyIq98Gos=', '', 0, 1),
(267, 137, 'https://media.istockphoto.com/id/2255598065/photo/men-wear-a-shirt-and-cufflinks-correct-clothes-dressing.webp?a=1&b=1&s=612x612&w=0&k=20&c=I9HN8bQhhwg0xNMgwjb8p2d2FSI87lTJOmbqMeQIuJE=', '', 1, 0),
(268, 137, 'https://media.istockphoto.com/id/2175186457/photo/getting-ready-for-the-ceremony.webp?a=1&b=1&s=612x612&w=0&k=20&c=puTDa0WDirWcIF4c9iH4jv8HQunclC31hLx8X8T5DLc=', '', 0, 1),
(269, 138, 'https://media.istockphoto.com/id/2162844257/photo/variety-of-wool-scarves-for-sale.webp?a=1&b=1&s=612x612&w=0&k=20&c=xWFnHbFfyBfvX_7vL69B4DJuZrF1g90QLeMcYxo9yp4=', '', 1, 0),
(270, 138, 'https://media.istockphoto.com/id/844894226/photo/muffler.jpg?s=612x612&w=0&k=20&c=G6E5tQ2X3pILebQ1xkiOFdjZIoQhCnTZAk1LlUZUpVE=', '', 0, 1),
(271, 139, 'https://media.istockphoto.com/id/2258780005/photo/black-card-holder-with-plastic-credit-cards-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zPV2hX5G2fsV8ViF5We2dI8W_AZCSapNX3JSgLi58w=', '', 1, 0),
(272, 139, 'https://media.istockphoto.com/id/2262598670/photo/hand-holding-slim-black-leather-wallet-with-credit-card.webp?a=1&b=1&s=612x612&w=0&k=20&c=KS4sTu28sf_T2Yt-dM1pXH1Zqw-scQ7alM_14eTxgD4=', '', 0, 1),
(275, 141, 'https://images.unsplash.com/photo-1670103589082-c4eab5f588f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Q2FudmFzJTIwV2Vla2VuZCUyMER1ZmZlbCUyMEJhZ3xlbnwwfHwwfHx8MA%', '', 1, 0),
(276, 141, 'https://plus.unsplash.com/premium_photo-1679314407939-858a78e9e1ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2FudmFzJTIwV2Vla2VuZCUyMER1ZmZlbCUyMEJhZ3xlbnwwfHwwf', '', 0, 1),
(277, 142, 'https://media.istockphoto.com/id/1481405284/photo/fluttering-piece-of-fabric-on-the-wind-veil-on-the-sky-3d-rendering.jpg?s=612x612&w=0&k=20&c=u7NNbP8SKUf0ljlD6WcuyiTylq_x0UD4G2IeGbeHbzU=', '', 1, 0),
(279, 143, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop', '', 1, 0),
(280, 143, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop', '', 0, 1),
(281, 144, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop', '', 1, 0),
(282, 144, 'https://images.unsplash.com/photo-1643444685523-ec29acf44d7a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RnJlc2h3YXRlciUyMFBlYXJsJTIwTmVja2xhY2V8ZW58MHx8MHx8fDA%3D', '', 0, 1),
(283, 145, 'https://images.unsplash.com/photo-1758995119744-6454f091303f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3RhY2thYmxlJTIwR29sZCUyMEJhbmdsZSUyMFNldHxlbnwwfHwwfHx8MA%', '', 1, 0),
(284, 145, 'https://images.unsplash.com/photo-1758995116383-f51775896add?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U3RhY2thYmxlJTIwR29sZCUyMEJhbmdsZSUyMFNldHxlbnwwfHwwfHx8MA%', '', 0, 1),
(285, 146, 'https://images.unsplash.com/photo-1646106481228-a4241a5109ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFBlYmJsZWQlMjBMZWF0aGVyJTIwQ3Jvc3Nib2R5fGVufDB8fDB8fHww', '', 1, 0),
(286, 146, 'https://images.unsplash.com/photo-1657603764636-8d31e033d591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fFBlYmJsZWQlMjBMZWF0aGVyJTIwQ3Jvc3Nib2R5fGVufDB8fDB8fHww', '', 0, 1),
(287, 147, 'https://images.unsplash.com/photo-1751551683757-9363ba2b7466?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q3J5c3RhbCUyMEhhaXIlMjBQaW4lMjBTZXR8ZW58MHx8MHx8fDA%3D', '', 1, 0),
(288, 147, 'https://plus.unsplash.com/premium_photo-1766436242787-f80264be3d83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q3J5c3RhbCUyMEhhaXIlMjBQaW4lMjBTZXR8ZW58MHx8MHx8fDA%3', '', 0, 1),
(291, 149, 'https://images.unsplash.com/photo-1599108859614-c293188135b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3VlZGUlMjBFbnZlbG9wZSUyMENsdXRjaHxlbnwwfHwwfHx8MA%3D%3D', '', 1, 0),
(292, 149, 'https://images.unsplash.com/photo-1696192505937-08400f91e631?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFN1ZWRlJTIwRW52ZWxvcGUlMjBDbHV0Y2h8ZW58MHx8MHx8fDA%3D', '', 0, 1),
(293, 150, 'https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9zZSUyMEdvbGQlMjBDaGFybSUyMEJyYWNlbGV0fGVufDB8fDB8f', '', 1, 0),
(294, 150, 'https://images.unsplash.com/photo-1720528347585-02ae5d2504bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um9zZSUyMEdvbGQlMjBDaGFybSUyMEJyYWNlbGV0fGVufDB8fDB8fHww', '', 0, 1),
(295, 151, 'https://images.unsplash.com/photo-1713425886296-da757c1f401e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VmVsdmV0JTIwTWluaSUyMENvaW4lMjBQdXJzZXxlbnwwfHwwfHx8MA%3D%3', '', 1, 0),
(296, 151, 'https://images.unsplash.com/photo-1681302184213-7f0a7b8fe6f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFZlbHZldCUyME1pbmklMjBDb2luJTIwUHVyc2V8ZW58MHx8MHx8fDA%3D', '', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store_review`
--

CREATE TABLE `store_review` (
  `id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_item`
--

CREATE TABLE `wishlist_item` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_user`
--
ALTER TABLE `accounts_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `accounts_user_groups`
--
ALTER TABLE `accounts_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_group` (`user_id`,`group_id`);

--
-- Indexes for table `accounts_user_user_permissions`
--
ALTER TABLE `accounts_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_perm` (`user_id`,`permission_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_cart`
--
ALTER TABLE `cart_cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  ADD KEY `fk_item_product` (`product_id`);

--
-- Indexes for table `contact_message`
--
ALTER TABLE `contact_message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_read` (`is_read`),
  ADD KEY `idx_contact_email` (`email`);

--
-- Indexes for table `coupons_coupon`
--
ALTER TABLE `coupons_coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_accounts_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `orders_address`
--
ALTER TABLE `orders_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_address_user` (`user_id`);

--
-- Indexes for table `orders_order`
--
ALTER TABLE `orders_order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_order_user` (`user_id`),
  ADD KEY `idx_order_status` (`status`),
  ADD KEY `idx_order_number` (`order_number`);

--
-- Indexes for table `orders_order_item`
--
ALTER TABLE `orders_order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_item_product` (`product_id`),
  ADD KEY `idx_order_item_order` (`order_id`);

--
-- Indexes for table `store_category`
--
ALTER TABLE `store_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`);

--
-- Indexes for table `store_product`
--
ALTER TABLE `store_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_is_featured` (`is_featured`),
  ADD KEY `idx_price` (`price`);
ALTER TABLE `store_product` ADD FULLTEXT KEY `ft_product_search` (`name`,`description`,`brand`);

--
-- Indexes for table `store_product_image`
--
ALTER TABLE `store_product_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_image` (`product_id`),
  ADD KEY `idx_order` (`order`);

--
-- Indexes for table `store_review`
--
ALTER TABLE `store_review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `store_review_user_id_product_id_570b3e18_uniq` (`user_id`,`product_id`),
  ADD KEY `store_review_product_id_abc413b2_fk_store_product_id` (`product_id`);

--
-- Indexes for table `wishlist_item`
--
ALTER TABLE `wishlist_item`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlist_item_user_id_product_id_3ff1525c_uniq` (`user_id`,`product_id`),
  ADD KEY `wishlist_item_product_id_96fdfd59_fk_store_product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_user`
--
ALTER TABLE `accounts_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `accounts_user_groups`
--
ALTER TABLE `accounts_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accounts_user_user_permissions`
--
ALTER TABLE `accounts_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `cart_cart`
--
ALTER TABLE `cart_cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_message`
--
ALTER TABLE `contact_message`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `coupons_coupon`
--
ALTER TABLE `coupons_coupon`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `orders_address`
--
ALTER TABLE `orders_address`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders_order`
--
ALTER TABLE `orders_order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders_order_item`
--
ALTER TABLE `orders_order_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `store_category`
--
ALTER TABLE `store_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `store_product`
--
ALTER TABLE `store_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `store_product_image`
--
ALTER TABLE `store_product_image`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=297;

--
-- AUTO_INCREMENT for table `store_review`
--
ALTER TABLE `store_review`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlist_item`
--
ALTER TABLE `wishlist_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissions_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_group_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);

--
-- Constraints for table `cart_cart`
--
ALTER TABLE `cart_cart`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `fk_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart_cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);

--
-- Constraints for table `orders_address`
--
ALTER TABLE `orders_address`
  ADD CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders_order`
--
ALTER TABLE `orders_order`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders_order_item`
--
ALTER TABLE `orders_order_item`
  ADD CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `store_product`
--
ALTER TABLE `store_product`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `store_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `store_product_image`
--
ALTER TABLE `store_product_image`
  ADD CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `store_review`
--
ALTER TABLE `store_review`
  ADD CONSTRAINT `store_review_product_id_abc413b2_fk_store_product_id` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`),
  ADD CONSTRAINT `store_review_user_id_cc54d86d_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);

--
-- Constraints for table `wishlist_item`
--
ALTER TABLE `wishlist_item`
  ADD CONSTRAINT `wishlist_item_product_id_96fdfd59_fk_store_product_id` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`),
  ADD CONSTRAINT `wishlist_item_user_id_aec1a08a_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
