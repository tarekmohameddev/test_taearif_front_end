-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 01, 2026 at 10:50 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_big`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0 - deactive, 1 - active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_articles`
--

CREATE TABLE `admin_articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `body` longtext NOT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','scheduled','archived') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `og_image` varchar(255) DEFAULT NULL,
  `cta_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `cta_text` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `cta_target_blank` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_articles_categories`
--

CREATE TABLE `admin_articles_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_crm_cards`
--

CREATE TABLE `admin_crm_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `color` varchar(7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_impersonations`
--

CREATE TABLE `admin_impersonations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Admin who initiated impersonation',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'User being impersonated (tenant)',
  `token_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Sanctum personal access token ID',
  `started_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'When impersonation started',
  `ended_at` timestamp NULL DEFAULT NULL COMMENT 'When impersonation ended (NULL = active)',
  `duration_seconds` int(11) DEFAULT NULL COMMENT 'Session duration in seconds',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP address (IPv4/IPv6)',
  `user_agent` text DEFAULT NULL COMMENT 'Browser user agent',
  `reason` varchar(255) DEFAULT NULL COMMENT 'Why admin is impersonating (optional)',
  `actions_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Number of API calls made during session',
  `status` enum('active','ended','expired','revoked') NOT NULL DEFAULT 'active' COMMENT 'Session status',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `affiliate_transactions`
--

CREATE TABLE `affiliate_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `affiliate_id` bigint(20) UNSIGNED NOT NULL,
  `referral_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('pending','collected') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `analytics_daily_summary`
--

CREATE TABLE `analytics_daily_summary` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `total_page_views` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `total_sessions` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `total_users` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `unique_pages` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_about_settings`
--

CREATE TABLE `api_about_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `history` text DEFAULT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_affiliate_users`
--

CREATE TABLE `api_affiliate_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_account_number` varchar(255) NOT NULL,
  `iban` varchar(255) NOT NULL,
  `commission_percentage` decimal(5,2) NOT NULL DEFAULT 0.15,
  `pending_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `request_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `start_date_value` date DEFAULT NULL,
  `to_date_value` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_apps`
--

CREATE TABLE `api_apps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `billing_type` enum('free','paid','paid_trial') NOT NULL DEFAULT 'free',
  `trial_days` smallint(6) DEFAULT NULL,
  `subscription_duration` int(11) DEFAULT 30,
  `img` text DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL DEFAULT 0.00,
  `type` enum('builtin','marketplace') NOT NULL DEFAULT 'marketplace',
  `rating` double(8,2) NOT NULL DEFAULT 0.00,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_banner_settings`
--

CREATE TABLE `api_banner_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `banner_type` varchar(255) NOT NULL DEFAULT 'static',
  `static` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`static`)),
  `slider` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`slider`)),
  `common` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`common`)),
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_categories`
--

CREATE TABLE `api_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_content_sections`
--

CREATE TABLE `api_content_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`info`)),
  `badge` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`badge`)),
  `lastUpdate` varchar(255) DEFAULT NULL,
  `lastUpdateFormatted` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_customers`
--

CREATE TABLE `api_customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `procedure_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `responsible_employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `district_id` bigint(20) UNSIGNED DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `source` varchar(50) DEFAULT NULL COMMENT 'Source: manual, property_request, whatsapp, import, etc.',
  `source_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID of the source record',
  `remember_token` varchar(255) DEFAULT NULL,
  `created_by_type` enum('user','employee','system') NOT NULL DEFAULT 'system',
  `created_by_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_customer_dropdown_settings`
--

CREATE TABLE `api_customer_dropdown_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `show_login` tinyint(1) NOT NULL DEFAULT 1,
  `show_register` tinyint(1) NOT NULL DEFAULT 1,
  `show_dashboard` tinyint(1) NOT NULL DEFAULT 1,
  `show_logout` tinyint(1) NOT NULL DEFAULT 1,
  `additional_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_customer_inquiry`
--

CREATE TABLE `api_customer_inquiry` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `inquiry_type` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `currency` varchar(8) DEFAULT NULL,
  `bedrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `bathrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `min_area_sqm` decimal(10,2) DEFAULT NULL,
  `max_area_sqm` decimal(10,2) DEFAULT NULL,
  `furnished` tinyint(1) DEFAULT NULL,
  `urgency` varchar(16) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `country_code` varchar(2) DEFAULT NULL,
  `region_code` varchar(4) DEFAULT NULL,
  `region_name` varchar(64) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `district` varchar(128) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `location_confidence` decimal(3,2) DEFAULT NULL,
  `source_channel` varchar(32) DEFAULT NULL,
  `lang` varchar(8) DEFAULT NULL,
  `detected_entities_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detected_entities_json`)),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_customer_property_interested`
--

CREATE TABLE `api_customer_property_interested` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_domains_settings`
--

CREATE TABLE `api_domains_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `custom_domain_id` int(11) DEFAULT NULL,
  `custom_name` varchar(255) NOT NULL,
  `registrar` varchar(100) DEFAULT NULL,
  `status` enum('pending','active','failed') NOT NULL DEFAULT 'pending',
  `primary` tinyint(1) NOT NULL DEFAULT 0,
  `ssl` tinyint(1) NOT NULL DEFAULT 0,
  `auto_renewal` tinyint(1) NOT NULL DEFAULT 0,
  `dns_records` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dns_records`)),
  `added_date` date NOT NULL,
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_employee_activity_logs`
--

CREATE TABLE `api_employee_activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `actor_type` varchar(255) NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `target_type` varchar(255) DEFAULT NULL,
  `target_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_footer_settings`
--

CREATE TABLE `api_footer_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `general` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`general`)),
  `social` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social`)),
  `columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`columns`)),
  `newsletter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newsletter`)),
  `style` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`style`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_general_settings`
--

CREATE TABLE `api_general_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `site_name` varchar(255) NOT NULL DEFAULT 'site_name',
  `tagline` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `favicon` varchar(255) DEFAULT NULL,
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT 0,
  `show_breadcrumb` tinyint(1) NOT NULL DEFAULT 1,
  `additional_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `show_properties` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_installations`
--

CREATE TABLE `api_installations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `app_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('installed','uninstalled','trialing','pending_payment','expired') NOT NULL DEFAULT 'installed',
  `invoice_id` varchar(255) DEFAULT NULL,
  `recurring_id` varchar(255) DEFAULT NULL,
  `activated_at` timestamp NULL DEFAULT NULL,
  `trial_used_at` timestamp NULL DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `current_period_end` timestamp NULL DEFAULT NULL,
  `payment_subscription_id` varchar(255) DEFAULT NULL,
  `installed` tinyint(1) NOT NULL DEFAULT 0,
  `installed_at` timestamp NULL DEFAULT NULL,
  `uninstalled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_installation_settings`
--

CREATE TABLE `api_installation_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `installation_id` bigint(20) UNSIGNED NOT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_media`
--

CREATE TABLE `api_media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `mediable_id` bigint(20) UNSIGNED DEFAULT NULL,
  `mediable_type` varchar(255) DEFAULT NULL,
  `disk` varchar(255) NOT NULL DEFAULT 'public',
  `path` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_menu_items`
--

CREATE TABLE `api_menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `is_external` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `show_on_mobile` tinyint(1) NOT NULL DEFAULT 1,
  `show_on_desktop` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `target` varchar(255) NOT NULL DEFAULT '_self'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_menu_settings`
--

CREATE TABLE `api_menu_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `menu_position` varchar(255) NOT NULL DEFAULT 'top',
  `menu_style` varchar(255) NOT NULL DEFAULT 'standard',
  `mobile_menu_type` varchar(255) NOT NULL DEFAULT 'hamburger',
  `is_sticky` tinyint(1) NOT NULL DEFAULT 1,
  `is_transparent` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('on','off') NOT NULL DEFAULT 'off'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_model_has_permissions`
--

CREATE TABLE `api_model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_model_has_roles`
--

CREATE TABLE `api_model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_permissions`
--

CREATE TABLE `api_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL COMMENT 'Arabic display name',
  `name_en` varchar(255) DEFAULT NULL COMMENT 'English display name',
  `guard_name` varchar(255) NOT NULL,
  `team_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_pixels`
--

CREATE TABLE `api_pixels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `platform` enum('facebook','tiktok','snapchat') NOT NULL,
  `pixel_id` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_posts`
--

CREATE TABLE `api_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `thumbnail_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_post_categories`
--

CREATE TABLE `api_post_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_roles`
--

CREATE TABLE `api_roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `team_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL COMMENT 'Arabic display name',
  `name_en` varchar(255) DEFAULT NULL COMMENT 'English display name',
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_role_has_permissions`
--

CREATE TABLE `api_role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_sidebar_items`
--

CREATE TABLE `api_sidebar_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `permission` varchar(255) DEFAULT NULL,
  `condition_type` enum('has_projects','has_properties','is_affiliate_approved') DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_themes_settings`
--

CREATE TABLE `api_themes_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `theme_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `popular` tinyint(1) NOT NULL DEFAULT 0,
  `is_free` tinyint(1) NOT NULL DEFAULT 0,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_user_categories`
--

CREATE TABLE `api_user_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` enum('property','project') NOT NULL,
  `is_active` varchar(255) NOT NULL DEFAULT '1',
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_user_category_settings`
--

CREATE TABLE `api_user_category_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_payment_transactions`
--

CREATE TABLE `app_payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `installation_id` bigint(20) UNSIGNED NOT NULL,
  `app_id` bigint(20) UNSIGNED NOT NULL,
  `payment_transaction_id` varchar(255) NOT NULL,
  `gateway` varchar(255) NOT NULL DEFAULT 'arb',
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `verified_at` timestamp NULL DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_requests`
--

CREATE TABLE `app_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `app_id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `basic_extendeds`
--

CREATE TABLE `basic_extendeds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `cookie_alert_status` tinyint(4) NOT NULL DEFAULT 1,
  `cookie_alert_text` blob DEFAULT NULL,
  `cookie_alert_button_text` varchar(255) DEFAULT NULL,
  `to_mail` varchar(255) DEFAULT NULL,
  `default_language_direction` varchar(20) NOT NULL DEFAULT 'ltr' COMMENT 'ltr / rtl',
  `from_mail` varchar(255) DEFAULT NULL,
  `from_name` varchar(255) DEFAULT NULL,
  `is_smtp` tinyint(4) NOT NULL DEFAULT 0,
  `smtp_host` varchar(255) DEFAULT NULL,
  `smtp_port` varchar(30) DEFAULT NULL,
  `encryption` varchar(30) DEFAULT NULL,
  `smtp_username` varchar(255) DEFAULT NULL,
  `smtp_password` varchar(255) DEFAULT NULL,
  `base_currency_symbol` blob DEFAULT NULL,
  `base_currency_symbol_position` varchar(10) NOT NULL DEFAULT 'left',
  `base_currency_text` varchar(100) DEFAULT NULL,
  `base_currency_text_position` varchar(10) NOT NULL DEFAULT 'right',
  `base_currency_rate` decimal(8,2) NOT NULL DEFAULT 0.00,
  `hero_section_title` varchar(255) DEFAULT NULL,
  `hero_section_text` varchar(255) DEFAULT NULL,
  `hero_section_button_text` varchar(30) DEFAULT NULL,
  `hero_section_button_url` text DEFAULT NULL,
  `hero_section_video_url` text DEFAULT NULL,
  `hero_img` varchar(50) DEFAULT NULL,
  `timezone` text DEFAULT NULL,
  `contact_addresses` text DEFAULT NULL,
  `contact_numbers` text DEFAULT NULL,
  `contact_mails` text DEFAULT NULL,
  `is_whatsapp` tinyint(4) NOT NULL DEFAULT 1,
  `whatsapp_number` varchar(50) DEFAULT NULL,
  `whatsapp_header_title` varchar(255) DEFAULT NULL,
  `whatsapp_popup_message` text DEFAULT NULL,
  `whatsapp_popup` tinyint(4) NOT NULL DEFAULT 1,
  `domain_request_success_message` varchar(255) DEFAULT NULL,
  `cname_record_section_title` varchar(255) DEFAULT NULL,
  `cname_record_section_text` text DEFAULT NULL,
  `package_features` text DEFAULT NULL,
  `expiration_reminder` int(11) NOT NULL DEFAULT 3,
  `custom_css` longtext DEFAULT NULL,
  `custom_js` longtext DEFAULT NULL,
  `email_password_reset_template` varchar(255) DEFAULT NULL,
  `welcome_message_template` varchar(255) DEFAULT NULL,
  `subscription_expiration_template` varchar(255) DEFAULT NULL,
  `subscription_expired_template` varchar(255) DEFAULT NULL,
  `welcome_message_email_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `subscription_expiration_email_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `subscription_expired_email_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `hero_section_subtitle` varchar(255) DEFAULT NULL,
  `hero_section_secound_button_text` varchar(255) DEFAULT NULL,
  `hero_section_secound_button_url` varchar(255) DEFAULT NULL,
  `hero_img2` varchar(255) DEFAULT NULL,
  `hero_img3` varchar(255) DEFAULT NULL,
  `hero_img4` varchar(255) DEFAULT NULL,
  `hero_img5` varchar(255) DEFAULT NULL,
  `email_notifications_enabled` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `basic_settings`
--

CREATE TABLE `basic_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `favicon` varchar(50) DEFAULT NULL,
  `logo` varchar(50) DEFAULT NULL,
  `preloader_status` tinyint(4) NOT NULL DEFAULT 1,
  `preloader` varchar(50) DEFAULT NULL,
  `website_title` varchar(255) DEFAULT NULL,
  `base_color` varchar(30) DEFAULT NULL,
  `breadcrumb` varchar(50) DEFAULT NULL,
  `footer_logo` varchar(50) DEFAULT NULL,
  `footer_text` varchar(255) DEFAULT NULL,
  `newsletter_text` varchar(255) DEFAULT NULL,
  `copyright_text` blob DEFAULT NULL,
  `intro_subtitle` varchar(50) DEFAULT NULL,
  `intro_title` varchar(50) DEFAULT NULL,
  `intro_text` text DEFAULT NULL,
  `intro_main_image` varchar(191) DEFAULT NULL,
  `tawk_to_script` text DEFAULT NULL,
  `is_recaptcha` tinyint(4) NOT NULL DEFAULT 0,
  `google_recaptcha_site_key` varchar(255) DEFAULT NULL,
  `google_recaptcha_secret_key` varchar(255) DEFAULT NULL,
  `is_tawkto` tinyint(4) NOT NULL DEFAULT 1,
  `tawkto_property_id` varchar(255) DEFAULT NULL,
  `is_disqus` tinyint(4) NOT NULL DEFAULT 1,
  `is_user_disqus` tinyint(4) NOT NULL DEFAULT 1,
  `disqus_shortname` varchar(255) DEFAULT NULL,
  `disqus_script` text DEFAULT NULL,
  `maintainance_mode` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - active, 0 - deactive',
  `maintainance_text` text DEFAULT NULL,
  `maintenance_img` varchar(50) DEFAULT NULL,
  `maintenance_status` tinyint(4) NOT NULL DEFAULT 0,
  `secret_path` varchar(255) DEFAULT NULL,
  `feature_section` tinyint(4) NOT NULL DEFAULT 1,
  `process_section` tinyint(4) NOT NULL DEFAULT 1,
  `featured_users_section` tinyint(4) NOT NULL DEFAULT 1,
  `pricing_section` tinyint(4) NOT NULL DEFAULT 1,
  `partners_section` tinyint(4) NOT NULL DEFAULT 1,
  `intro_section` tinyint(4) NOT NULL DEFAULT 1,
  `testimonial_section` tinyint(4) NOT NULL DEFAULT 1,
  `feature_title` varchar(255) DEFAULT NULL,
  `work_process_title` varchar(255) DEFAULT NULL,
  `work_process_subtitle` varchar(255) DEFAULT NULL,
  `featured_users_title` varchar(255) DEFAULT NULL,
  `featured_users_subtitle` varchar(255) DEFAULT NULL,
  `pricing_title` varchar(255) DEFAULT NULL,
  `pricing_subtitle` varchar(255) DEFAULT NULL,
  `testimonial_title` varchar(255) DEFAULT NULL,
  `testimonial_subtitle` varchar(255) DEFAULT NULL,
  `news_section` tinyint(4) NOT NULL DEFAULT 1,
  `top_footer_section` tinyint(4) NOT NULL DEFAULT 1,
  `copyright_section` tinyint(4) NOT NULL DEFAULT 1,
  `blog_title` varchar(255) DEFAULT NULL,
  `blog_subtitle` varchar(255) DEFAULT NULL,
  `useful_links_title` varchar(50) DEFAULT NULL,
  `newsletter_title` varchar(50) DEFAULT NULL,
  `newsletter_subtitle` varchar(255) DEFAULT NULL,
  `is_whatsapp` tinyint(4) NOT NULL DEFAULT 1,
  `whatsapp_number` varchar(50) DEFAULT NULL,
  `whatsapp_header_title` varchar(255) DEFAULT NULL,
  `whatsapp_popup_message` text DEFAULT NULL,
  `whatsapp_popup` tinyint(4) NOT NULL DEFAULT 1,
  `templates_section` tinyint(4) NOT NULL DEFAULT 1,
  `preview_templates_title` varchar(255) DEFAULT NULL,
  `preview_templates_subtitle` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `testimonial_image` varchar(255) DEFAULT NULL,
  `partners_section_title` varchar(255) DEFAULT NULL,
  `partners_section_subtitle` varchar(255) DEFAULT NULL,
  `pricing_text` text DEFAULT NULL,
  `vcard_section` tinyint(4) NOT NULL DEFAULT 1,
  `vcard_section_title` varchar(255) DEFAULT NULL,
  `vcard_section_subtitle` varchar(255) DEFAULT NULL,
  `intro_button_name` varchar(255) DEFAULT NULL,
  `intro_button_url` varchar(255) DEFAULT NULL,
  `adsense_publisher_id` varchar(100) DEFAULT NULL,
  `email_verification_status` tinyint(4) NOT NULL DEFAULT 1,
  `whatsapp_service` enum('meta_cloud','evolution_api') DEFAULT NULL,
  `meta_access_token` text DEFAULT NULL,
  `meta_phone_number_id` varchar(255) DEFAULT NULL,
  `meta_business_account_id` varchar(255) DEFAULT NULL,
  `meta_template_name` varchar(255) DEFAULT NULL,
  `meta_template_language` varchar(255) DEFAULT NULL,
  `meta_test_template_name` varchar(255) DEFAULT NULL,
  `evolution_api_url` varchar(255) DEFAULT NULL,
  `evolution_api_key` text DEFAULT NULL,
  `evolution_instance_name` varchar(255) DEFAULT NULL,
  `evolution_phone_number` varchar(255) DEFAULT NULL,
  `welcome_message_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `welcome_message_text` text DEFAULT NULL,
  `welcome_message_delay` int(11) NOT NULL DEFAULT 5,
  `welcome_message_template` varchar(255) DEFAULT NULL,
  `welcome_message_api` varchar(255) DEFAULT NULL,
  `subscription_expiration_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `subscription_expiration_text` text DEFAULT NULL,
  `subscription_expiration_days_before` int(11) NOT NULL DEFAULT 3,
  `subscription_expiration_template` varchar(255) DEFAULT NULL,
  `subscription_expiration_send_time` time NOT NULL DEFAULT '09:00:00',
  `subscription_expiration_api` varchar(255) DEFAULT NULL,
  `email_password_reset_template` varchar(255) DEFAULT NULL,
  `subscription_expired_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `subscription_expired_text` text DEFAULT NULL,
  `subscription_expired_template` varchar(255) DEFAULT NULL,
  `subscription_expired_send_time` time NOT NULL DEFAULT '09:00:00',
  `subscription_expired_api` varchar(255) DEFAULT NULL,
  `password_reset_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `password_reset_text` text DEFAULT NULL,
  `password_reset_template` varchar(255) DEFAULT NULL,
  `password_reset_api` varchar(255) DEFAULT NULL,
  `whatsapp_notifications_enabled` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bcategories`
--

CREATE TABLE `bcategories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `serial_number` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `bcategory_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `content` blob DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `booking_status` enum('pending','confirmed','canceled') NOT NULL DEFAULT 'pending',
  `booking_type` enum('hold','enquiry','reservation') NOT NULL DEFAULT 'hold',
  `notes` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT NULL,
  `payment_details` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `deed_number` varchar(255) DEFAULT NULL,
  `deed_image` varchar(255) DEFAULT NULL,
  `water_meter_number` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `card_logs`
--

CREATE TABLE `card_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `card_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(50) NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `actor_type` varchar(20) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_histories`
--

CREATE TABLE `chat_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`history`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `contract_value` decimal(15,2) NOT NULL,
  `contract_type` enum('Standard','Contracts under Seal','Lease Agreement','Other') NOT NULL DEFAULT 'Standard',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `contract_status` varchar(255) NOT NULL DEFAULT 'draft',
  `is_signed` tinyint(1) NOT NULL DEFAULT 0,
  `signed_name` varchar(255) DEFAULT NULL,
  `signed_date` timestamp NULL DEFAULT NULL,
  `signed_ip` varchar(255) DEFAULT NULL,
  `signature_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `value` decimal(11,2) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `packages` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `maximum_uses_limit` varchar(255) DEFAULT NULL,
  `total_uses` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit_packages`
--

CREATE TABLE `credit_packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `supports_marketing_channels` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `marketing_priority` int(11) NOT NULL DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `marketing_features` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit_transactions`
--

CREATE TABLE `credit_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `credit_package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `transaction_type` varchar(255) NOT NULL,
  `credits_amount` int(11) NOT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `reference_number` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crm_cards`
--

CREATE TABLE `crm_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `card_customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `card_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `card_content` text DEFAULT NULL,
  `card_procedure` enum('reminder','note','interaction','appointment') NOT NULL,
  `card_project` bigint(20) UNSIGNED DEFAULT NULL,
  `card_property` bigint(20) UNSIGNED DEFAULT NULL,
  `card_date` timestamp NULL DEFAULT NULL,
  `reminder_sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crm_requests`
--

CREATE TABLE `crm_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `property_specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`property_specifications`)),
  `position` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verification_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `shpping_fname` varchar(255) DEFAULT NULL,
  `shpping_lname` varchar(255) DEFAULT NULL,
  `shpping_email` varchar(255) DEFAULT NULL,
  `shpping_number` varchar(255) DEFAULT NULL,
  `shpping_city` varchar(255) DEFAULT NULL,
  `shpping_state` varchar(255) DEFAULT NULL,
  `shpping_address` varchar(255) DEFAULT NULL,
  `shpping_country` varchar(255) DEFAULT NULL,
  `billing_fname` varchar(255) DEFAULT NULL,
  `billing_lname` varchar(255) DEFAULT NULL,
  `billing_email` varchar(255) DEFAULT NULL,
  `billing_number` varchar(255) DEFAULT NULL,
  `billing_city` varchar(255) DEFAULT NULL,
  `billing_state` varchar(255) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `billing_country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_logs`
--

CREATE TABLE `customer_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(40) NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `actor_type` enum('employee','tenant','system') NOT NULL DEFAULT 'tenant',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_wish_lists`
--

CREATE TABLE `customer_wish_lists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domain_renewal_pricings`
--

CREATE TABLE `domain_renewal_pricings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `custom_domain_id` int(11) DEFAULT NULL,
  `registrar` varchar(100) DEFAULT NULL,
  `period_key` varchar(50) NOT NULL,
  `label` varchar(255) NOT NULL,
  `years` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'SAR',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `subject` text NOT NULL,
  `content` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL DEFAULT 'ar',
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `character_count` int(11) NOT NULL DEFAULT 0,
  `email_type` varchar(100) DEFAULT NULL,
  `email_subject` text DEFAULT NULL,
  `email_body` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `embeddings`
--

CREATE TABLE `embeddings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `text` text NOT NULL,
  `embedding` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`embedding`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_addons`
--

CREATE TABLE `employee_addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `qty` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `payment_ref` varchar(255) NOT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `expire_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_addon_plans`
--

CREATE TABLE `employee_addon_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT 1,
  `duration_unit` enum('day','month','year') NOT NULL DEFAULT 'month',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `question` varchar(255) DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `governorates`
--

CREATE TABLE `governorates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `region_id` bigint(20) UNSIGNED NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `isthara`
--

CREATE TABLE `isthara` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_contents`
--

CREATE TABLE `item_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_images`
--

CREATE TABLE `item_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_reviews`
--

CREATE TABLE `item_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `review` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'tenant / job owner',
  `name` varchar(255) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `email` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `pdf_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `is_default` tinyint(4) NOT NULL DEFAULT 1,
  `rtl` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 - LTR, 1- RTL',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `source` enum('website','referral','ads','manual','other') NOT NULL DEFAULT 'manual',
  `status` enum('new','contacted','qualified','lost','converted') NOT NULL DEFAULT 'new',
  `stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assigned_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `converted_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `converted_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_activities`
--

CREATE TABLE `lead_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lead_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('note','call','email','meeting','task','other') NOT NULL DEFAULT 'note',
  `description` text NOT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketing_channels`
--

CREATE TABLE `marketing_channels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `number` varchar(50) NOT NULL,
  `business_id` varchar(100) DEFAULT NULL,
  `phone_id` varchar(100) DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_connected` tinyint(1) NOT NULL DEFAULT 0,
  `sent_messages_count` int(11) NOT NULL DEFAULT 0,
  `received_messages_count` int(11) NOT NULL DEFAULT 0,
  `additional_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_settings`)),
  `crm_integration_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `appointment_system_integration_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `customers_page_integration_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `rental_page_integration_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `integration_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`integration_settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketing_channel_pricing`
--

CREATE TABLE `marketing_channel_pricing` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `channel_type` varchar(50) DEFAULT NULL,
  `credits_per_message` int(11) NOT NULL,
  `price_per_credit` decimal(10,4) NOT NULL,
  `effective_price_per_message` decimal(10,4) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `channel_specific_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`channel_specific_settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `package_price` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `coupon_code` varchar(255) DEFAULT NULL,
  `price` double NOT NULL DEFAULT 0,
  `currency` varchar(255) NOT NULL,
  `currency_symbol` varchar(255) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0 - pending, 1 - success, 2 - rejected / removed',
  `is_trial` tinyint(1) NOT NULL DEFAULT 0,
  `trial_days` int(11) NOT NULL DEFAULT 0,
  `receipt` longtext DEFAULT NULL,
  `transaction_details` longtext DEFAULT NULL,
  `settings` longtext DEFAULT NULL,
  `package_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `modified` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - modified by Admin, 0 - not modified by Admin',
  `conversation_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `membership_change_logs`
--

CREATE TABLE `membership_change_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `previous_package` varchar(255) DEFAULT NULL,
  `new_package` varchar(255) DEFAULT NULL,
  `event_timestamp` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `menus` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offline_gateways`
--

CREATE TABLE `offline_gateways` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `instructions` blob DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `is_receipt` tinyint(4) NOT NULL DEFAULT 1,
  `receipt` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `identifier` varchar(255) DEFAULT NULL,
  `otp` varchar(255) NOT NULL,
  `otp_expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `owner_rentals`
--

CREATE TABLE `owner_rentals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `owner_rental_property`
--

CREATE TABLE `owner_rental_property` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `owner_rental_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  `term` varchar(255) DEFAULT NULL,
  `featured` enum('0','1') NOT NULL DEFAULT '0',
  `is_trial` enum('0','1') NOT NULL DEFAULT '0',
  `trial_days` int(11) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `new_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_features`)),
  `features` text DEFAULT NULL,
  `meta_keywords` longtext DEFAULT NULL,
  `meta_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `number_of_vcards` int(11) DEFAULT NULL,
  `video_size_limit` double(8,2) DEFAULT NULL,
  `file_size_limit` double(8,2) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `project_limit_number` int(11) DEFAULT NULL,
  `real_estate_limit_number` int(11) DEFAULT NULL,
  `whatsapp_numbers_limit` int(11) NOT NULL DEFAULT 0,
  `employees_limit` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `body` blob DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pageview_analytics`
--

CREATE TABLE `pageview_analytics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` varchar(255) NOT NULL,
  `page_slug` varchar(255) NOT NULL DEFAULT '',
  `dynamic_slug` varchar(255) DEFAULT NULL,
  `full_path` varchar(500) DEFAULT NULL,
  `page_path` varchar(500) NOT NULL,
  `page_title` varchar(500) DEFAULT NULL,
  `page_type` enum('page','post','project','property') DEFAULT NULL,
  `views_count` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `sessions_count` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `users_count` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `date_bucket` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_logs`
--

CREATE TABLE `password_reset_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `method` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `expires_at` timestamp NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `blocked` tinyint(1) NOT NULL DEFAULT 0,
  `blocked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_gateways`
--

CREATE TABLE `payment_gateways` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'manual',
  `information` mediumtext DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_invoices`
--

CREATE TABLE `payment_invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `InvoiceId` bigint(20) UNSIGNED NOT NULL,
  `InvoiceStatus` varchar(255) NOT NULL,
  `InvoiceValue` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `InvoiceDisplayValue` varchar(255) NOT NULL,
  `TransactionId` bigint(20) UNSIGNED NOT NULL,
  `TransactionStatus` varchar(255) NOT NULL,
  `PaymentGateway` varchar(255) NOT NULL,
  `PaymentId` bigint(20) UNSIGNED NOT NULL,
  `CardNumber` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `popups`
--

CREATE TABLE `popups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `background_image` varchar(100) DEFAULT NULL,
  `background_color` varchar(100) DEFAULT NULL,
  `background_opacity` decimal(8,2) NOT NULL DEFAULT 1.00,
  `title` varchar(255) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_url` text DEFAULT NULL,
  `button_color` varchar(20) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `delay` int(11) NOT NULL DEFAULT 1000 COMMENT 'in milisconds',
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `type` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 - active, 0 - deactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `processes`
--

CREATE TABLE `processes` (
  `id` int(11) NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `subtitle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_logs`
--

CREATE TABLE `project_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(40) NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `actor_type` enum('employee','tenant','system') NOT NULL DEFAULT 'tenant',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_logs`
--

CREATE TABLE `property_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(40) NOT NULL,
  `actor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `actor_type` enum('employee','tenant','system') NOT NULL DEFAULT 'tenant',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_matches`
--

CREATE TABLE `property_matches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_key` varchar(32) DEFAULT NULL,
  `request_type` enum('web','whatsapp') NOT NULL,
  `request_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `match_score` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `database_score` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `ai_score` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `match_explanation` text DEFAULT NULL,
  `matched_criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`matched_criteria`)),
  `is_reviewed` tinyint(1) NOT NULL DEFAULT 0,
  `is_contacted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_request_auto_customer_settings`
--

CREATE TABLE `property_request_auto_customer_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `auto_create_customer` tinyint(1) NOT NULL DEFAULT 0,
  `default_stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_request_statuses`
--

CREATE TABLE `property_request_statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `display_order` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_requests`
--

CREATE TABLE `purchase_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `request_number` varchar(255) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_email` varchar(255) NOT NULL,
  `client_phone` varchar(255) NOT NULL,
  `client_national_id` varchar(255) DEFAULT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority` enum('منخفضة','متوسطة','عالية','عاجل') NOT NULL DEFAULT 'متوسطة',
  `budget_amount` decimal(15,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `overall_status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `progress_percentage` int(11) NOT NULL DEFAULT 0,
  `request_date` timestamp NOT NULL DEFAULT '2025-09-28 07:42:32',
  `expected_completion_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_request_stages`
--

CREATE TABLE `purchase_request_stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_request_id` bigint(20) UNSIGNED NOT NULL,
  `stage_name` enum('الحجز','العقد','الإنجاز','الاستلام') NOT NULL,
  `status` enum('الانتظار','قيد التنفيذ','مكتمل') NOT NULL DEFAULT 'الانتظار',
  `stage_order` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `reminder_type_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL COMMENT 'Reminder title (custom or from type)',
  `description` text DEFAULT NULL,
  `datetime` datetime NOT NULL COMMENT 'Reminder date and time',
  `priority` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0=Low, 1=Medium, 2=High',
  `status` enum('pending','completed','overdue','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reminder_types`
--

CREATE TABLE `reminder_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Type name (e.g., "Call", "Meeting")',
  `name_ar` varchar(255) DEFAULT NULL COMMENT 'Arabic name',
  `description` text DEFAULT NULL,
  `color` varchar(50) NOT NULL DEFAULT '#6366f1' COMMENT 'Hex color for UI',
  `icon` varchar(100) NOT NULL DEFAULT 'Bell' COMMENT 'Icon name for UI',
  `order` int(11) NOT NULL DEFAULT 0 COMMENT 'Display order',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rental_cost_items`
--

CREATE TABLE `rental_cost_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  `type` enum('fixed','percentage') NOT NULL,
  `payer` enum('owner','tenant') NOT NULL,
  `payment_frequency` enum('one_time','per_installment') NOT NULL,
  `percentage_of` decimal(12,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(10) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(40) NOT NULL,
  `desired_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `deposit_amount` decimal(12,2) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_contracts`
--

CREATE TABLE `rm_contracts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `property_name` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','active','expired','terminated') NOT NULL,
  `termination_reason` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `grace_period_months` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_expenses`
--

CREATE TABLE `rm_expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `expense_name` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `amount_type` enum('percentage','fixed') NOT NULL,
  `amount_value` decimal(10,2) NOT NULL,
  `cost_center` enum('tenant','owner') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_maintenance_tickets`
--

CREATE TABLE `rm_maintenance_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(50) NOT NULL,
  `priority` enum('low','medium','high','critical') NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `estimated_cost` decimal(12,2) DEFAULT NULL,
  `payer` enum('landlord','tenant','shared') DEFAULT NULL,
  `payer_share_percent` tinyint(4) DEFAULT NULL,
  `status` enum('open','in_progress','on_hold','resolved','cancelled') NOT NULL DEFAULT 'open',
  `scheduled_date` date DEFAULT NULL,
  `assigned_to_vendor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `attachments_count` smallint(6) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_payments`
--

CREATE TABLE `rm_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `contract_id` bigint(20) UNSIGNED DEFAULT NULL,
  `installment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cost_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `installment_sequence` int(11) DEFAULT NULL COMMENT 'Which installment payment this applies to (1st, 2nd, 3rd, etc.)',
  `payment_type` enum('rent','platform_fee','water_fee','office_fee','deposit') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','bank_transfer','credit_card','online_payment','check','other') NOT NULL DEFAULT 'bank_transfer',
  `bank_name` varchar(100) DEFAULT NULL,
  `receipt_image_path` varchar(500) DEFAULT NULL,
  `transfer_to` enum('منصة ناجز','المالك','المكتب') NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_payment_installments`
--

CREATE TABLE `rm_payment_installments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `contract_id` bigint(20) UNSIGNED NOT NULL,
  `sequence_no` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','partial','overdue','void','cancelled') NOT NULL DEFAULT 'pending',
  `payment_type` enum('none','partial','full') NOT NULL DEFAULT 'none',
  `payment_status` enum('not_due','paid_in_full','paid_in_part','late','cancelled') NOT NULL DEFAULT 'not_due',
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paid_at` datetime DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_reminders`
--

CREATE TABLE `rm_reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('payment_due','payment_overdue','contract_expiring') NOT NULL,
  `entity_type` varchar(40) NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `due_on` date NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` enum('pending','sent','dismissed','snoozed') NOT NULL DEFAULT 'pending',
  `snooze_until` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rm_rentals`
--

CREATE TABLE `rm_rentals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `unit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `building_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rental_type` enum('monthly','annual') DEFAULT NULL,
  `rental_duration` int(11) DEFAULT NULL,
  `tenant_full_name` varchar(150) NOT NULL,
  `tenant_phone` varchar(32) NOT NULL,
  `tenant_email` varchar(150) DEFAULT NULL,
  `tenant_job_title` varchar(120) DEFAULT NULL,
  `tenant_social_status` enum('single','married','divorced','widowed','other') DEFAULT NULL,
  `tenant_national_id` varchar(20) DEFAULT NULL,
  `base_rent_amount` decimal(12,2) DEFAULT NULL,
  `currency` char(3) NOT NULL DEFAULT 'SAR',
  `contract_number` varchar(255) DEFAULT NULL,
  `total_rental_amount` decimal(12,2) DEFAULT NULL,
  `move_in_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `termination_reason` varchar(255) DEFAULT NULL,
  `paying_plan` enum('monthly','quarterly','semi_annual','annual') DEFAULT NULL,
  `rental_period` smallint(6) DEFAULT NULL,
  `status` enum('draft','active','ended','cancelled') NOT NULL DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `permissions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `contract_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `sale_date` datetime NOT NULL,
  `status` enum('pending','completed','canceled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seos`
--

CREATE TABLE `seos` (
  `id` int(11) NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `home_meta_keywords` text DEFAULT NULL,
  `home_meta_description` text DEFAULT NULL,
  `profiles_meta_keywords` text DEFAULT NULL,
  `profiles_meta_description` text DEFAULT NULL,
  `pricing_meta_keywords` text DEFAULT NULL,
  `pricing_meta_description` text DEFAULT NULL,
  `blogs_meta_keywords` text DEFAULT NULL,
  `blogs_meta_description` text DEFAULT NULL,
  `faqs_meta_keywords` text DEFAULT NULL,
  `faqs_meta_description` text DEFAULT NULL,
  `contact_meta_keywords` text DEFAULT NULL,
  `contact_meta_description` text DEFAULT NULL,
  `login_meta_keywords` text DEFAULT NULL,
  `login_meta_description` text DEFAULT NULL,
  `forget_password_meta_keywords` text DEFAULT NULL,
  `forget_password_meta_description` text DEFAULT NULL,
  `checkout_meta_keywords` text DEFAULT NULL,
  `checkout_meta_description` text DEFAULT NULL,
  `website_template_keywords` text DEFAULT NULL,
  `website_template_description` text DEFAULT NULL,
  `vcard_template_keywords` text DEFAULT NULL,
  `vcard_template_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sitemaps`
--

CREATE TABLE `sitemaps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sitemap_url` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `slug_tenant_cache`
--

CREATE TABLE `slug_tenant_cache` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(500) NOT NULL,
  `slug_type` enum('property','project') NOT NULL,
  `tenant_id` varchar(255) NOT NULL,
  `cached_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `socials`
--

CREATE TABLE `socials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_items`
--

CREATE TABLE `subscription_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `subscription_id` int(10) UNSIGNED NOT NULL,
  `stripe_id` varchar(255) NOT NULL,
  `stripe_product` varchar(255) NOT NULL,
  `stripe_price` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_center_articles`
--

CREATE TABLE `support_center_articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `body` longtext NOT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','scheduled','archived') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `cta_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `cta_text` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `cta_target_blank` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_center_categories`
--

CREATE TABLE `support_center_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `icon_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_form_submissions`
--

CREATE TABLE `tenant_form_submissions` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `form_type` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `submitted_at` timestamp NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_global_components`
--

CREATE TABLE `tenant_global_components` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `published_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`published_data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_media`
--

CREATE TABLE `tenant_media` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `disk` varchar(255) NOT NULL DEFAULT 'public',
  `path` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `mime` varchar(255) DEFAULT NULL,
  `size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_pages`
--

CREATE TABLE `tenant_pages` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `components` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`components`)),
  `published_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`published_data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_settings`
--

CREATE TABLE `tenant_settings` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings`)),
  `version` varchar(255) NOT NULL DEFAULT '1',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_static_pages`
--

CREATE TABLE `tenant_static_pages` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `components` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`components`)),
  `published_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`published_data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_website_layouts`
--

CREATE TABLE `tenant_website_layouts` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `published_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`published_data`)),
  `themes_backup` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`themes_backup`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rank` varchar(255) DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rating` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timezones`
--

CREATE TABLE `timezones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `country_code` varchar(10) NOT NULL,
  `timezone` varchar(125) NOT NULL,
  `gmt_offset` decimal(10,2) NOT NULL,
  `dst_offset` decimal(10,2) NOT NULL,
  `raw_offset` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ulinks`
--

CREATE TABLE `ulinks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `account_type` varchar(255) NOT NULL DEFAULT 'tenant',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subscribed` tinyint(1) NOT NULL DEFAULT 0,
  `subscription_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `referral_code` varchar(255) DEFAULT NULL,
  `referred_by` bigint(20) UNSIGNED DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `rbac_version` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `rbac_seeded_at` timestamp NULL DEFAULT NULL,
  `featured` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `online_status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = Active ,0 = offline',
  `verification_link` text DEFAULT NULL,
  `email_verified` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - verified, 0 - not verified',
  `subdomain_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 - pending, 1 - connected',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `preview_template` tinyint(4) NOT NULL DEFAULT 0,
  `template_img` varchar(100) DEFAULT NULL,
  `template_serial_number` int(11) NOT NULL DEFAULT 0,
  `pm_type` varchar(255) DEFAULT NULL,
  `pm_last_four` varchar(4) DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `template_name` varchar(255) DEFAULT NULL,
  `show_home` tinyint(4) DEFAULT NULL COMMENT '0 = no, 1 = yes',
  `onboarding_completed` tinyint(1) NOT NULL DEFAULT 0,
  `industry_type` varchar(255) DEFAULT NULL,
  `company_size` varchar(50) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `primary_color` varchar(255) NOT NULL DEFAULT '#000000',
  `show_even_if_empty` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_appointments`
--

CREATE TABLE `users_api_customers_appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `priority` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=low, 2=medium, 3=high',
  `note` text DEFAULT NULL,
  `datetime` datetime NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_priorities`
--

CREATE TABLE `users_api_customers_priorities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` tinyint(4) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_procedures`
--

CREATE TABLE `users_api_customers_procedures` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `procedure_name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_reminders`
--

CREATE TABLE `users_api_customers_reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `priority` tinyint(4) DEFAULT NULL COMMENT '1=low, 2=medium, 3=high',
  `datetime` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_stages`
--

CREATE TABLE `users_api_customers_stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stage_name` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_api_customers_types`
--

CREATE TABLE `users_api_customers_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `order` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_property_requests`
--

CREATE TABLE `users_property_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `purpose` enum('rent','sale') DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `districts_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` enum('سكني','تجاري','صناعي','زراعي') DEFAULT NULL,
  `neighborhoods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`neighborhoods`)),
  `area_from` int(11) DEFAULT NULL,
  `area_to` int(11) DEFAULT NULL,
  `purchase_method` enum('كاش','تمويل بنكي') DEFAULT NULL,
  `budget_from` decimal(15,2) DEFAULT NULL,
  `budget_to` decimal(15,2) DEFAULT NULL,
  `seriousness` enum('مستعد فورًا','خلال شهر','خلال 3 أشهر','لاحقًا / استكشاف فقط') DEFAULT NULL,
  `purchase_goal` enum('سكن خاص','استثمار وتأجير','بناء وبيع','مشروع تجاري') DEFAULT NULL,
  `wants_similar_offers` tinyint(1) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `contact_on_whatsapp` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_action_sections`
--

CREATE TABLE `user_action_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `background_image` varchar(255) NOT NULL,
  `first_title` varchar(255) DEFAULT NULL,
  `second_title` varchar(255) DEFAULT NULL,
  `first_button` varchar(255) DEFAULT NULL,
  `first_button_url` varchar(255) DEFAULT NULL,
  `second_button` varchar(255) DEFAULT NULL,
  `second_button_url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_logs`
--

CREATE TABLE `user_activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_amenities`
--

CREATE TABLE `user_amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_basic_settings`
--

CREATE TABLE `user_basic_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `favicon` text DEFAULT NULL,
  `breadcrumb` varchar(255) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `preloader` text DEFAULT NULL,
  `base_color` varchar(20) NOT NULL DEFAULT 'ff4a17',
  `theme` varchar(50) NOT NULL DEFAULT 'home_one' COMMENT 'home_one, home_two',
  `email` varchar(50) DEFAULT NULL,
  `from_name` varchar(50) DEFAULT NULL,
  `is_quote` tinyint(4) NOT NULL DEFAULT 1,
  `user_id` int(11) NOT NULL,
  `qr_image` varchar(100) DEFAULT NULL,
  `qr_color` varchar(50) NOT NULL DEFAULT '000000',
  `qr_size` int(11) NOT NULL DEFAULT 250,
  `qr_style` varchar(250) NOT NULL DEFAULT 'square',
  `qr_eye_style` varchar(250) NOT NULL DEFAULT 'square',
  `qr_margin` int(11) NOT NULL DEFAULT 0,
  `qr_text` varchar(255) DEFAULT NULL,
  `qr_text_color` varchar(50) NOT NULL DEFAULT '000000',
  `qr_text_size` int(11) NOT NULL DEFAULT 15,
  `qr_text_x` int(11) NOT NULL DEFAULT 50,
  `qr_text_y` int(11) NOT NULL DEFAULT 50,
  `qr_inserted_image` varchar(250) DEFAULT NULL,
  `qr_inserted_image_size` int(11) NOT NULL DEFAULT 20,
  `qr_inserted_image_x` int(11) NOT NULL DEFAULT 50,
  `qr_inserted_image_y` int(11) NOT NULL DEFAULT 50,
  `qr_type` varchar(50) NOT NULL DEFAULT 'default' COMMENT 'default, image, text',
  `qr_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `whatsapp_status` tinyint(4) NOT NULL DEFAULT 0,
  `whatsapp_number` varchar(30) DEFAULT NULL,
  `whatsapp_header_title` varchar(255) DEFAULT NULL,
  `whatsapp_popup_status` tinyint(4) NOT NULL DEFAULT 0,
  `whatsapp_popup_message` text DEFAULT NULL,
  `disqus_status` tinyint(4) NOT NULL DEFAULT 0,
  `disqus_short_name` varchar(30) DEFAULT NULL,
  `analytics_status` tinyint(4) NOT NULL DEFAULT 0,
  `measurement_id` varchar(100) DEFAULT NULL,
  `pixel_status` tinyint(4) NOT NULL DEFAULT 0,
  `pixel_id` varchar(30) DEFAULT NULL,
  `tawkto_status` tinyint(4) NOT NULL DEFAULT 0,
  `tawkto_direct_chat_link` varchar(255) DEFAULT NULL,
  `custom_css` longtext DEFAULT NULL,
  `website_title` varchar(255) DEFAULT NULL,
  `base_currency_symbol` varchar(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/98/Saudi_Riyal_Symbol.svg',
  `base_currency_symbol_position` varchar(255) DEFAULT 'left',
  `base_currency_text` varchar(255) DEFAULT 'SAR',
  `base_currency_rate` decimal(8,2) DEFAULT NULL,
  `base_currency_text_position` varchar(255) DEFAULT NULL,
  `secondary_color` varchar(255) DEFAULT NULL,
  `accent_color` varchar(7) DEFAULT NULL,
  `is_recaptcha` tinyint(4) NOT NULL DEFAULT 0,
  `google_recaptcha_site_key` varchar(255) DEFAULT NULL,
  `google_recaptcha_secret_key` varchar(255) DEFAULT NULL,
  `adsense_publisher_id` varchar(100) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `features_section_image` varchar(255) DEFAULT NULL,
  `cv` text DEFAULT NULL,
  `cv_original` varchar(255) DEFAULT NULL,
  `email_verification_status` tinyint(4) NOT NULL DEFAULT 1,
  `cookie_alert_status` tinyint(4) NOT NULL DEFAULT 0,
  `cookie_alert_text` text DEFAULT NULL,
  `cookie_alert_button_text` varchar(255) DEFAULT NULL,
  `property_country_status` tinyint(4) NOT NULL DEFAULT 1,
  `property_state_status` tinyint(4) NOT NULL DEFAULT 1,
  `short_description` text DEFAULT NULL,
  `industry_type` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `secondary` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_blogs`
--

CREATE TABLE `user_blogs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `language_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_blog_categories`
--

CREATE TABLE `user_blog_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `language_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_brands`
--

CREATE TABLE `user_brands` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `brand_img` varchar(255) NOT NULL,
  `brand_url` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_categories`
--

CREATE TABLE `user_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_choose_us_items`
--

CREATE TABLE `user_choose_us_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_cities`
--

CREATE TABLE `user_cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `country_id` bigint(20) UNSIGNED NOT NULL,
  `region_id` bigint(20) UNSIGNED NOT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_contacts`
--

CREATE TABLE `user_contacts` (
  `id` int(11) NOT NULL,
  `contact_form_image` text DEFAULT NULL,
  `contact_form_title` varchar(255) DEFAULT NULL,
  `contact_form_subtitle` varchar(255) DEFAULT NULL,
  `contact_addresses` text DEFAULT NULL,
  `contact_numbers` text DEFAULT NULL,
  `contact_mails` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `map_zoom` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_counter_informations`
--

CREATE TABLE `user_counter_informations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_countries`
--

CREATE TABLE `user_countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_coupons`
--

CREATE TABLE `user_coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `value` decimal(11,2) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `minimum_spend` decimal(11,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_courses`
--

CREATE TABLE `user_courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `thumbnail_image` varchar(255) NOT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) NOT NULL,
  `pricing_type` varchar(255) NOT NULL,
  `previous_price` decimal(8,2) DEFAULT NULL,
  `current_price` decimal(8,2) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `is_featured` varchar(255) NOT NULL DEFAULT 'no',
  `average_rating` decimal(8,2) DEFAULT NULL,
  `duration` time DEFAULT '00:00:00',
  `certificate_status` tinyint(4) NOT NULL DEFAULT 1,
  `video_watching` tinyint(4) NOT NULL DEFAULT 1,
  `quiz_completion` tinyint(4) NOT NULL DEFAULT 0,
  `min_quiz_score` decimal(8,2) NOT NULL DEFAULT 0.00,
  `certificate_title` varchar(255) DEFAULT NULL,
  `certificate_text` mediumtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_categories`
--

CREATE TABLE `user_course_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `is_featured` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_enrolments`
--

CREATE TABLE `user_course_enrolments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `billing_first_name` varchar(255) NOT NULL,
  `billing_last_name` varchar(255) NOT NULL,
  `billing_email` varchar(255) NOT NULL,
  `billing_contact_number` varchar(255) NOT NULL,
  `billing_address` varchar(255) NOT NULL,
  `billing_city` varchar(255) NOT NULL,
  `billing_state` varchar(255) DEFAULT NULL,
  `billing_country` varchar(255) NOT NULL,
  `course_price` decimal(8,2) DEFAULT NULL,
  `discount` decimal(8,2) DEFAULT NULL,
  `grand_total` decimal(8,2) DEFAULT NULL,
  `currency_text` varchar(255) DEFAULT NULL,
  `currency_text_position` varchar(255) DEFAULT NULL,
  `currency_symbol` varchar(255) DEFAULT NULL,
  `currency_symbol_position` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `gateway_type` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `conversation_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_faqs`
--

CREATE TABLE `user_course_faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_informations`
--

CREATE TABLE `user_course_informations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `course_category_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `instructor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `features` text DEFAULT NULL,
  `description` blob DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `thanks_page_content` blob DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_instructors`
--

CREATE TABLE `user_course_instructors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `image` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_featured` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_instructor_social_links`
--

CREATE TABLE `user_course_instructor_social_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_modules`
--

CREATE TABLE `user_course_modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `course_information_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `duration` time NOT NULL DEFAULT '00:00:00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_course_reviews`
--

CREATE TABLE `user_course_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `rating` smallint(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_credits`
--

CREATE TABLE `user_credits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_credits` int(11) NOT NULL DEFAULT 0,
  `used_credits` int(11) NOT NULL DEFAULT 0,
  `monthly_limit` int(11) NOT NULL DEFAULT 5000,
  `average_cost_per_credit` decimal(8,4) NOT NULL DEFAULT 0.0500,
  `reset_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_custom_domains`
--

CREATE TABLE `user_custom_domains` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `requested_domain` varchar(255) DEFAULT NULL,
  `current_domain` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '0 - Pending, 1 - Connected, 2 - Rejected, 3 - Removed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_districts`
--

CREATE TABLE `user_districts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `city_name_ar` varchar(255) NOT NULL,
  `city_name_en` varchar(255) NOT NULL,
  `country_name_ar` varchar(255) NOT NULL,
  `country_name_en` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_donations`
--

CREATE TABLE `user_donations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `goal_amount` double NOT NULL,
  `min_amount` double NOT NULL,
  `custom_amount` longtext DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_donation_categories`
--

CREATE TABLE `user_donation_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `short_description` mediumtext DEFAULT NULL,
  `serial_number` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_featured` int(11) DEFAULT 0 COMMENT '1= featured, 0= none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_donation_contents`
--

CREATE TABLE `user_donation_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `donation_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `donation_category_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `meta_keywords` longtext DEFAULT NULL,
  `meta_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_donation_details`
--

CREATE TABLE `user_donation_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `donation_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT 'anonymous',
  `email` varchar(255) DEFAULT 'anonymous',
  `phone` varchar(255) DEFAULT 'xxxxxxxxxxxx',
  `amount` decimal(11,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(255) NOT NULL,
  `currency_position` varchar(255) NOT NULL DEFAULT 'right',
  `currency_symbol` varchar(255) NOT NULL,
  `currency_symbol_position` varchar(255) NOT NULL DEFAULT 'left',
  `payment_method` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `receipt` longtext DEFAULT NULL,
  `transaction_details` longtext DEFAULT NULL,
  `bex_details` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `conversation_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_donation_settings`
--

CREATE TABLE `user_donation_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `donation_guest_checkout` tinyint(4) NOT NULL DEFAULT 1 COMMENT '	1 - active, 0 - deactive',
  `is_donation` tinyint(4) NOT NULL DEFAULT 1 COMMENT '	1 - active, 0 - deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_educations`
--

CREATE TABLE `user_educations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `degree_name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_email_templates`
--

CREATE TABLE `user_email_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `email_type` varchar(255) DEFAULT NULL,
  `email_subject` text DEFAULT NULL,
  `email_body` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_facades`
--

CREATE TABLE `user_facades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_faqs`
--

CREATE TABLE `user_faqs` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `serial_number` int(11) NOT NULL,
  `featured` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1- featured, 0 - not featured',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_features`
--

CREATE TABLE `user_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_footer_quick_links`
--

CREATE TABLE `user_footer_quick_links` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_footer_texts`
--

CREATE TABLE `user_footer_texts` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `logo` text NOT NULL,
  `about_company` text DEFAULT NULL,
  `copyright_text` text DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `newsletter_text` varchar(255) DEFAULT NULL,
  `bg_image` varchar(255) DEFAULT NULL,
  `footer_color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_hero_sliders`
--

CREATE TABLE `user_hero_sliders` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `img` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `btn_name` varchar(50) DEFAULT NULL,
  `btn_url` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_hero_statics`
--

CREATE TABLE `user_hero_statics` (
  `id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `img` text DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `btn_name` varchar(50) DEFAULT NULL,
  `btn_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `hero_text` text DEFAULT NULL,
  `secound_btn_name` varchar(255) DEFAULT NULL,
  `secound_btn_url` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_home_page_texts`
--

CREATE TABLE `user_home_page_texts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `about_image` text DEFAULT NULL,
  `about_image_two` tinytext DEFAULT NULL,
  `about_title` text DEFAULT NULL,
  `about_subtitle` text DEFAULT NULL,
  `about_content` text DEFAULT NULL,
  `about_button_text` varchar(50) DEFAULT NULL,
  `about_button_url` varchar(255) DEFAULT NULL,
  `about_video_image` text DEFAULT NULL,
  `about_video_url` varchar(255) DEFAULT NULL,
  `skills_title` text DEFAULT NULL,
  `skills_subtitle` text DEFAULT NULL,
  `skills_content` text DEFAULT NULL,
  `service_title` text DEFAULT NULL,
  `service_subtitle` text DEFAULT NULL,
  `experience_title` text DEFAULT NULL,
  `experience_subtitle` text DEFAULT NULL,
  `portfolio_title` text DEFAULT NULL,
  `portfolio_subtitle` text DEFAULT NULL,
  `view_all_portfolio_text` varchar(255) DEFAULT NULL,
  `testimonial_title` text DEFAULT NULL,
  `testimonial_subtitle` text DEFAULT NULL,
  `testimonial_image` varchar(255) DEFAULT NULL,
  `blog_title` text DEFAULT NULL,
  `blog_subtitle` text DEFAULT NULL,
  `view_all_blog_text` varchar(255) DEFAULT NULL,
  `team_section_title` varchar(255) DEFAULT NULL,
  `team_section_subtitle` varchar(255) DEFAULT NULL,
  `video_section_image` varchar(255) DEFAULT NULL,
  `video_section_url` varchar(255) DEFAULT NULL,
  `video_section_title` varchar(255) DEFAULT NULL,
  `video_section_subtitle` varchar(255) DEFAULT NULL,
  `video_section_text` text DEFAULT NULL,
  `video_section_button_text` varchar(255) DEFAULT NULL,
  `video_section_button_url` varchar(255) DEFAULT NULL,
  `why_choose_us_section_image` varchar(255) DEFAULT NULL,
  `why_choose_us_section_image_two` tinytext DEFAULT NULL,
  `why_choose_us_section_title` varchar(255) DEFAULT NULL,
  `why_choose_us_section_subtitle` varchar(255) DEFAULT NULL,
  `why_choose_us_section_text` text DEFAULT NULL,
  `why_choose_us_section_button_text` varchar(255) DEFAULT NULL,
  `why_choose_us_section_button_url` varchar(255) DEFAULT NULL,
  `why_choose_us_section_video_image` varchar(255) DEFAULT NULL,
  `why_choose_us_section_video_url` varchar(255) DEFAULT NULL,
  `faq_section_image` varchar(255) DEFAULT NULL,
  `faq_section_title` varchar(255) DEFAULT NULL,
  `faq_section_subtitle` varchar(255) DEFAULT NULL,
  `work_process_section_title` varchar(255) DEFAULT NULL,
  `work_process_section_subtitle` varchar(255) DEFAULT NULL,
  `work_process_section_text` text DEFAULT NULL,
  `work_process_section_img` text DEFAULT NULL,
  `work_process_section_video_img` text DEFAULT NULL,
  `work_process_section_video_url` varchar(255) DEFAULT NULL,
  `quote_section_title` varchar(255) DEFAULT NULL,
  `quote_section_subtitle` varchar(255) DEFAULT NULL,
  `language_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `counter_section_image` varchar(255) DEFAULT NULL,
  `work_process_btn_txt` varchar(255) DEFAULT NULL,
  `work_process_btn_url` varchar(255) DEFAULT NULL,
  `contact_section_image` varchar(255) DEFAULT NULL,
  `contact_section_title` varchar(255) DEFAULT NULL,
  `contact_section_subtitle` varchar(255) DEFAULT NULL,
  `feature_item_title` varchar(255) DEFAULT NULL,
  `new_item_title` varchar(255) DEFAULT NULL,
  `newsletter_title` varchar(255) DEFAULT NULL,
  `newsletter_subtitle` text DEFAULT NULL,
  `bestseller_item_title` varchar(255) DEFAULT NULL,
  `special_item_title` varchar(255) DEFAULT NULL,
  `flashsale_item_title` varchar(255) DEFAULT NULL,
  `toprated_item_title` varchar(255) DEFAULT NULL,
  `category_section_title` varchar(255) DEFAULT NULL,
  `category_section_subtitle` varchar(255) DEFAULT NULL,
  `rooms_section_title` varchar(255) DEFAULT NULL,
  `rooms_section_subtitle` varchar(255) DEFAULT NULL,
  `rooms_section_content` text DEFAULT NULL,
  `featured_course_section_title` varchar(255) DEFAULT NULL,
  `newsletter_image` varchar(255) DEFAULT NULL,
  `featured_section_title` varchar(255) DEFAULT NULL,
  `featured_section_subtitle` varchar(255) DEFAULT NULL,
  `causes_section_title` varchar(255) DEFAULT NULL,
  `causes_section_subtitle` varchar(255) DEFAULT NULL,
  `about_snd_button_text` varchar(255) DEFAULT NULL,
  `about_snd_button_url` varchar(255) DEFAULT NULL,
  `skills_image` varchar(255) DEFAULT NULL,
  `job_education_title` varchar(255) DEFAULT NULL,
  `job_education_subtitle` varchar(255) DEFAULT NULL,
  `newsletter_snd_image` varchar(255) DEFAULT NULL,
  `donor_title` varchar(255) DEFAULT NULL,
  `years_of_expricence` int(11) DEFAULT NULL,
  `featured_property_title` varchar(255) DEFAULT NULL,
  `property_title` varchar(255) DEFAULT NULL,
  `city_title` varchar(255) DEFAULT NULL,
  `city_subtitle` text DEFAULT NULL,
  `project_title` varchar(255) DEFAULT NULL,
  `project_subtitle` text DEFAULT NULL,
  `testimonial_text` text DEFAULT NULL,
  `useful_footer_links` varchar(100) DEFAULT NULL,
  `contact_us_footer_links` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_home_sections`
--

CREATE TABLE `user_home_sections` (
  `id` int(11) NOT NULL,
  `intro_section` tinyint(4) DEFAULT 1,
  `featured_services_section` tinyint(4) DEFAULT 1,
  `video_section` tinyint(4) DEFAULT 1,
  `portfolio_section` tinyint(4) DEFAULT 1,
  `why_choose_us_section` tinyint(4) DEFAULT 1,
  `counter_info_section` tinyint(4) DEFAULT 1,
  `team_members_section` tinyint(4) DEFAULT 1,
  `skills_section` tinyint(4) DEFAULT 1,
  `testimonials_section` tinyint(4) DEFAULT 1,
  `brand_section` tinyint(4) DEFAULT 1,
  `blogs_section` tinyint(4) DEFAULT 1,
  `faq_section` tinyint(4) DEFAULT 1,
  `contact_section` tinyint(4) DEFAULT 1,
  `top_footer_section` tinyint(4) DEFAULT 1,
  `copyright_section` tinyint(4) DEFAULT 1,
  `work_process_section` tinyint(4) NOT NULL DEFAULT 1,
  `user_id` int(11) NOT NULL,
  `newsletter_section` tinyint(4) DEFAULT 1,
  `featured_section` int(11) DEFAULT NULL,
  `offer_banner_section` int(11) DEFAULT NULL,
  `category_section` tinyint(4) DEFAULT 1,
  `slider_section` tinyint(4) DEFAULT 1,
  `left_offer_banner_section` tinyint(4) DEFAULT 1,
  `bottom_offer_banner_section` tinyint(4) DEFAULT 1,
  `featured_item_section` tinyint(4) DEFAULT 1,
  `new_item_section` tinyint(4) DEFAULT 1,
  `toprated_item_section` tinyint(4) DEFAULT 1,
  `bestseller_item_section` tinyint(4) DEFAULT 1,
  `special_item_section` tinyint(4) DEFAULT 1,
  `flashsale_item_section` tinyint(4) DEFAULT 1,
  `rooms_section` tinyint(4) DEFAULT 1,
  `call_to_action_section_status` tinyint(4) DEFAULT 1,
  `featured_courses_section_status` tinyint(4) DEFAULT 1,
  `causes_section` tinyint(4) DEFAULT 1,
  `job_education_section` tinyint(4) DEFAULT 1,
  `featured_properties_section` int(11) DEFAULT 1,
  `property_section` int(11) DEFAULT 1,
  `project_section` int(11) DEFAULT 1,
  `cities_section` int(11) DEFAULT 1,
  `useful_links_section` tinyint(4) NOT NULL DEFAULT 0,
  `contact_us_section` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_items`
--

CREATE TABLE `user_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `sku` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `current_price` decimal(11,2) NOT NULL DEFAULT 0.00,
  `previous_price` decimal(11,2) NOT NULL DEFAULT 0.00,
  `is_feature` int(11) NOT NULL DEFAULT 0,
  `rating` decimal(11,2) NOT NULL DEFAULT 0.00,
  `type` varchar(100) DEFAULT NULL COMMENT 'digital - digital product, physical - physical product',
  `download_link` text DEFAULT NULL,
  `download_file` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `flash` varchar(255) DEFAULT NULL,
  `special_offer` int(11) DEFAULT NULL,
  `flash_percentage` int(11) DEFAULT NULL,
  `start_date_time` varchar(255) DEFAULT NULL,
  `end_date_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_item_categories`
--

CREATE TABLE `user_item_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `is_feature` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_item_contents`
--

CREATE TABLE `user_item_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_item_images`
--

CREATE TABLE `user_item_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_item_sub_categories`
--

CREATE TABLE `user_item_sub_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_item_variations`
--

CREATE TABLE `user_item_variations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `variant_name` text DEFAULT NULL,
  `option_name` text DEFAULT NULL,
  `option_price` text DEFAULT NULL,
  `option_stock` text DEFAULT NULL,
  `indx` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_jcategories`
--

CREATE TABLE `user_jcategories` (
  `id` bigint(20) NOT NULL,
  `language_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_jobs`
--

CREATE TABLE `user_jobs` (
  `id` bigint(20) NOT NULL,
  `jcategory_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `vacancy` int(11) DEFAULT NULL,
  `deadline` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `job_responsibilities` text DEFAULT NULL,
  `employment_status` varchar(255) DEFAULT NULL,
  `educational_requirements` text DEFAULT NULL,
  `experience_requirements` text DEFAULT NULL,
  `additional_requirements` text DEFAULT NULL,
  `job_location` varchar(255) DEFAULT NULL,
  `salary` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `read_before_apply` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_job_experiences`
--

CREATE TABLE `user_job_experiences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_continue` tinyint(4) NOT NULL DEFAULT 0,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_languages`
--

CREATE TABLE `user_languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `is_default` tinyint(4) NOT NULL DEFAULT 0,
  `rtl` tinyint(4) NOT NULL COMMENT '0 - LTR, 1- RTL',
  `keywords` longtext DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_lessons`
--

CREATE TABLE `user_lessons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED DEFAULT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `completion_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_complete`
--

CREATE TABLE `user_lesson_complete` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_contents`
--

CREATE TABLE `user_lesson_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `video_unique_name` varchar(255) DEFAULT NULL,
  `video_original_name` varchar(255) DEFAULT NULL,
  `video_duration` time DEFAULT NULL,
  `video_preview` varchar(255) DEFAULT NULL,
  `file_unique_name` varchar(255) DEFAULT NULL,
  `file_original_name` varchar(255) DEFAULT NULL,
  `text` blob DEFAULT NULL,
  `code` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `order_no` int(11) NOT NULL DEFAULT 1,
  `completion_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_content_complete`
--

CREATE TABLE `user_lesson_content_complete` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_content_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_lesson_quizzes`
--

CREATE TABLE `user_lesson_quizzes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_content_id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answers` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_members`
--

CREATE TABLE `user_members` (
  `id` int(11) NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `rank` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `featured` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_menus`
--

CREATE TABLE `user_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `menus` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_offer_banners`
--

CREATE TABLE `user_offer_banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `text_1` varchar(255) DEFAULT NULL,
  `text_2` varchar(255) DEFAULT NULL,
  `text_3` varchar(255) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_offline_gateways`
--

CREATE TABLE `user_offline_gateways` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `is_receipt` tinyint(4) NOT NULL DEFAULT 1,
  `receipt` int(11) DEFAULT NULL,
  `item_checkout_status` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_orders`
--

CREATE TABLE `user_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `billing_country` varchar(255) DEFAULT NULL,
  `billing_fname` varchar(255) DEFAULT NULL,
  `billing_lname` varchar(255) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `billing_city` varchar(255) DEFAULT NULL,
  `billing_email` varchar(255) DEFAULT NULL,
  `billing_number` varchar(255) DEFAULT NULL,
  `shpping_country` varchar(255) DEFAULT NULL,
  `shpping_fname` varchar(255) DEFAULT NULL,
  `shpping_lname` varchar(255) DEFAULT NULL,
  `shpping_address` varchar(255) DEFAULT NULL,
  `shpping_city` varchar(255) DEFAULT NULL,
  `shpping_email` varchar(255) DEFAULT NULL,
  `shpping_number` varchar(255) DEFAULT NULL,
  `cart_total` decimal(8,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(8,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(8,2) NOT NULL DEFAULT 0.00,
  `total` decimal(8,2) NOT NULL DEFAULT 0.00,
  `method` varchar(255) DEFAULT NULL,
  `gateway_type` varchar(255) DEFAULT NULL,
  `currency_code` varchar(255) DEFAULT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `shipping_method` varchar(255) DEFAULT NULL,
  `shipping_charge` decimal(8,2) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `txnid` varchar(255) DEFAULT NULL,
  `charge_id` varchar(255) DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `receipt` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `conversation_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_order_items`
--

CREATE TABLE `user_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `previous_price` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `variations` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_pages`
--

CREATE TABLE `user_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `body` blob DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_payment_gateways`
--

CREATE TABLE `user_payment_gateways` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'manual',
  `information` mediumtext DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `package_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `permissions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_portfolios`
--

CREATE TABLE `user_portfolios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `status` varchar(10) DEFAULT '0',
  `client_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `submission_date` date DEFAULT NULL,
  `website_link` varchar(255) DEFAULT NULL,
  `featured` int(11) NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_portfolio_categories`
--

CREATE TABLE `user_portfolio_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_featured` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_portfolio_images`
--

CREATE TABLE `user_portfolio_images` (
  `id` int(11) NOT NULL,
  `user_portfolio_id` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_projects`
--

CREATE TABLE `user_projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `min_price` decimal(18,2) DEFAULT NULL,
  `max_price` decimal(18,2) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `complete_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `published` tinyint(1) DEFAULT 1,
  `developer` varchar(255) DEFAULT NULL,
  `completion_date` varchar(255) DEFAULT NULL,
  `units` int(11) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_project_contents`
--

CREATE TABLE `user_project_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_project_floorplan_imgs`
--

CREATE TABLE `user_project_floorplan_imgs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_project_gallery_imgs`
--

CREATE TABLE `user_project_gallery_imgs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_project_specifications`
--

CREATE TABLE `user_project_specifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_project_types`
--

CREATE TABLE `user_project_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `min_area` int(11) NOT NULL,
  `max_area` int(11) DEFAULT NULL,
  `min_price` double(10,2) NOT NULL,
  `max_price` double(10,2) DEFAULT NULL,
  `unit` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_properties`
--

CREATE TABLE `user_properties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `region_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_method` enum('monthly','quarterly','semi_annual','annual') DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `building_id` bigint(20) UNSIGNED DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `water_meter_number` varchar(255) DEFAULT NULL,
  `electricity_meter_number` varchar(255) DEFAULT NULL,
  `deed_number` varchar(255) DEFAULT NULL,
  `advertising_license` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `floor_planning_image` text DEFAULT NULL,
  `video_image` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `pricePerMeter` decimal(15,2) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL COMMENT 'residential,commercial',
  `beds` int(11) DEFAULT NULL,
  `bath` int(11) DEFAULT NULL,
  `area` decimal(15,2) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL COMMENT 'Property size information',
  `video_url` varchar(255) DEFAULT NULL,
  `virtual_tour` text DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `completion_status` enum('complete','incomplete','pending_review') NOT NULL DEFAULT 'complete' COMMENT 'Property completion status for imports',
  `missing_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of missing required field names' CHECK (json_valid(`missing_fields`)),
  `validation_errors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of validation errors' CHECK (json_valid(`validation_errors`)),
  `import_batch_id` varchar(255) DEFAULT NULL COMMENT 'Groups related incomplete properties from same import',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT 'When property was completed',
  `property_status` enum('rented','for_rent','sale','for_sale','available') NOT NULL DEFAULT 'available' COMMENT 'Property rental/sale status',
  `featured` tinyint(1) DEFAULT 0,
  `show_reservations` tinyint(1) NOT NULL DEFAULT 1,
  `features` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `features_text` varchar(255) GENERATED ALWAYS AS (coalesce(convert(json_unquote(json_extract(`features`,'$')) using utf8mb4),'')) VIRTUAL,
  `faqs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`faqs`)),
  `latitude` decimal(10,6) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `reorder` int(11) DEFAULT 0,
  `reorder_featured` int(11) DEFAULT 0,
  `owner_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_amenities`
--

CREATE TABLE `user_property_amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `amenity_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_categories`
--

CREATE TABLE `user_property_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `featured` tinyint(4) NOT NULL DEFAULT 0,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_characteristics`
--

CREATE TABLE `user_property_characteristics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `facade_id` bigint(20) UNSIGNED DEFAULT NULL,
  `length` decimal(15,2) DEFAULT NULL,
  `width` decimal(15,2) DEFAULT NULL,
  `street_width_north` decimal(15,2) DEFAULT NULL,
  `street_width_south` decimal(15,2) DEFAULT NULL,
  `street_width_east` decimal(15,2) DEFAULT NULL,
  `street_width_west` decimal(15,2) DEFAULT NULL,
  `building_age` int(11) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `kitchen` int(11) DEFAULT NULL,
  `driver_room` int(11) DEFAULT NULL,
  `maid_room` int(11) DEFAULT NULL,
  `dining_room` int(11) DEFAULT NULL,
  `living_room` int(11) DEFAULT NULL,
  `majlis` int(11) DEFAULT NULL,
  `storage_room` int(11) DEFAULT NULL,
  `basement` int(11) DEFAULT NULL,
  `swimming_pool` int(11) DEFAULT NULL,
  `balcony` int(11) DEFAULT NULL,
  `garden` int(11) DEFAULT NULL,
  `annex` int(11) DEFAULT NULL,
  `elevator` int(11) DEFAULT NULL,
  `private_parking` int(11) DEFAULT NULL,
  `size` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_contacts`
--

CREATE TABLE `user_property_contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_contents`
--

CREATE TABLE `user_property_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `state_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `meta_keyword` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_features`
--

CREATE TABLE `user_property_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `water_rooms` int(11) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `driver_room` int(11) DEFAULT NULL,
  `maid_room` int(11) DEFAULT NULL,
  `dining_room` int(11) DEFAULT NULL,
  `living_room` int(11) DEFAULT NULL,
  `swimming_pool` int(11) DEFAULT NULL,
  `basement` int(11) DEFAULT NULL,
  `storage` int(11) DEFAULT NULL,
  `majlis` int(11) DEFAULT NULL,
  `balcony` int(11) DEFAULT NULL,
  `kitchen` int(11) DEFAULT NULL,
  `garden` int(11) DEFAULT NULL,
  `annex` int(11) DEFAULT NULL,
  `elevator` tinyint(1) NOT NULL DEFAULT 0,
  `dedicated_parking` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_request_field_settings`
--

CREATE TABLE `user_property_request_field_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `field_key` varchar(64) NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` smallint(6) DEFAULT NULL,
  `label_ar` varchar(255) DEFAULT NULL,
  `label_en` varchar(255) DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_slider_imgs`
--

CREATE TABLE `user_property_slider_imgs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_specifications`
--

CREATE TABLE `user_property_specifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `key` int(11) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_property_wishlists`
--

CREATE TABLE `user_property_wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `property_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_qr_codes`
--

CREATE TABLE `user_qr_codes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_quiz_scores`
--

CREATE TABLE `user_quiz_scores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_quotes`
--

CREATE TABLE `user_quotes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fields` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0-pending, 1-prcessing, 2-completed, 3-rejected',
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_quote_inputs`
--

CREATE TABLE `user_quote_inputs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL COMMENT '1-text, 2-select, 3-checkbox, 4-textarea, 5-file',
  `label` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `required` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - required, 0 - optional',
  `order_number` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_quote_input_options`
--

CREATE TABLE `user_quote_input_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quote_input_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_rooms`
--

CREATE TABLE `user_rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `slider_imgs` text NOT NULL,
  `featured_img` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `bed` smallint(6) NOT NULL,
  `bath` smallint(6) NOT NULL,
  `max_guests` int(11) DEFAULT NULL,
  `rent` decimal(8,2) NOT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 means will not show in home page, 1 means will show in home page',
  `avg_rating` decimal(8,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_amenities`
--

CREATE TABLE `user_room_amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `serial_number` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_bookings`
--

CREATE TABLE `user_room_bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_number` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `arrival_date` date NOT NULL,
  `departure_date` date NOT NULL,
  `guests` int(11) NOT NULL,
  `subtotal` double(8,2) DEFAULT NULL,
  `discount` double(8,2) NOT NULL,
  `grand_total` double(8,2) NOT NULL,
  `currency_symbol` varchar(255) NOT NULL,
  `currency_symbol_position` varchar(255) NOT NULL,
  `currency_text` varchar(255) NOT NULL,
  `currency_text_position` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `gateway_type` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `payment_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 -> payment incomplete, 1 -> payment complete',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `conversation_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_categories`
--

CREATE TABLE `user_room_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_contents`
--

CREATE TABLE `user_room_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `room_category_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `description` blob NOT NULL,
  `amenities` text NOT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_coupons`
--

CREATE TABLE `user_room_coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `value` decimal(8,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `serial_number` int(11) NOT NULL,
  `rooms` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_reviews`
--

CREATE TABLE `user_room_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `rating` smallint(6) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_room_settings`
--

CREATE TABLE `user_room_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_room` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 = active, 0 = deactive',
  `room_category_status` tinyint(4) DEFAULT 1 COMMENT 'if is 1 active, 0 deactive',
  `room_guest_checkout_status` tinyint(4) DEFAULT 0 COMMENT 'if is 1 active, 0 deactive',
  `room_rating_status` tinyint(4) DEFAULT 0 COMMENT 'if is 1 active, 0 deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_seos`
--

CREATE TABLE `user_seos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `home_meta_keywords` text DEFAULT NULL,
  `home_meta_description` text DEFAULT NULL,
  `services_meta_keywords` text DEFAULT NULL,
  `services_meta_description` text DEFAULT NULL,
  `blogs_meta_keywords` text DEFAULT NULL,
  `blogs_meta_description` text DEFAULT NULL,
  `portfolios_meta_keywords` text DEFAULT NULL,
  `portfolios_meta_description` text DEFAULT NULL,
  `jobs_meta_description` text DEFAULT NULL,
  `jobs_meta_keywords` varchar(255) DEFAULT NULL,
  `team_meta_keywords` varchar(255) DEFAULT NULL,
  `team_meta_description` varchar(255) DEFAULT NULL,
  `faqs_meta_description` varchar(255) DEFAULT NULL,
  `faqs_meta_keywords` varchar(255) DEFAULT NULL,
  `contact_meta_description` varchar(255) DEFAULT NULL,
  `contact_meta_keywords` varchar(255) DEFAULT NULL,
  `quote_meta_description` text DEFAULT NULL,
  `quote_meta_keywords` varchar(255) DEFAULT NULL,
  `shop_meta_keywords` varchar(255) DEFAULT NULL,
  `shop_meta_description` varchar(255) DEFAULT NULL,
  `item_details_meta_keywords` varchar(255) DEFAULT NULL,
  `item_details_meta_description` varchar(255) DEFAULT NULL,
  `cart_meta_keywords` varchar(255) DEFAULT NULL,
  `cart_meta_description` varchar(255) DEFAULT NULL,
  `checkout_meta_keywords` varchar(255) DEFAULT NULL,
  `checkout_meta_description` varchar(255) DEFAULT NULL,
  `meta_description_signup` varchar(255) DEFAULT NULL,
  `meta_keyword_signup` varchar(255) DEFAULT NULL,
  `meta_description_login` varchar(255) DEFAULT NULL,
  `meta_keyword_login` varchar(255) DEFAULT NULL,
  `meta_keyword_rooms` varchar(255) DEFAULT NULL,
  `meta_description_rooms` text DEFAULT NULL,
  `meta_keyword_room_details` varchar(255) DEFAULT NULL,
  `meta_description_room_details` text DEFAULT NULL,
  `meta_keyword_course` varchar(255) DEFAULT NULL,
  `meta_description_course` text DEFAULT NULL,
  `meta_keyword_course_details` varchar(255) DEFAULT NULL,
  `meta_description_course_details` text DEFAULT NULL,
  `meta_keyword_properties` varchar(255) DEFAULT NULL,
  `meta_description_properties` text DEFAULT NULL,
  `meta_keyword_projects` varchar(255) DEFAULT NULL,
  `meta_description_projects` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_services`
--

CREATE TABLE `user_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `featured` int(11) NOT NULL,
  `detail_page` int(11) NOT NULL,
  `lang_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `meta_keywords` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shipping_charges`
--

CREATE TABLE `user_shipping_charges` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `charge` decimal(11,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shop_settings`
--

CREATE TABLE `user_shop_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `is_shop` tinyint(4) NOT NULL DEFAULT 1,
  `catalog_mode` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - active, 0 - deactive',
  `item_rating_system` tinyint(4) NOT NULL DEFAULT 1,
  `tax` decimal(8,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `percentage` int(11) DEFAULT NULL,
  `color` varchar(20) NOT NULL DEFAULT 'F78058',
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `language_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_socials`
--

CREATE TABLE `user_socials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `icon` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_states`
--

CREATE TABLE `user_states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `country_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_steps`
--

CREATE TABLE `user_steps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `projects` tinyint(1) NOT NULL DEFAULT 0,
  `properties` tinyint(1) NOT NULL DEFAULT 0,
  `logo_uploaded` tinyint(1) NOT NULL DEFAULT 0,
  `favicon_uploaded` tinyint(1) NOT NULL DEFAULT 0,
  `website_named` tinyint(1) NOT NULL DEFAULT 0,
  `homepage_updated` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `sub_pages_upper_image` tinyint(1) NOT NULL DEFAULT 0,
  `menu_builder` tinyint(1) NOT NULL DEFAULT 0,
  `footer` tinyint(1) NOT NULL DEFAULT 0,
  `homepage_about_update` tinyint(1) NOT NULL DEFAULT 0,
  `banner` tinyint(1) NOT NULL DEFAULT 0,
  `services` tinyint(1) NOT NULL DEFAULT 0,
  `contacts_social_info` tinyint(1) NOT NULL DEFAULT 0,
  `user_contact` tinyint(4) NOT NULL DEFAULT 0,
  `user_hero_static` tinyint(4) NOT NULL DEFAULT 0,
  `user_skill` tinyint(4) NOT NULL DEFAULT 0,
  `user_portfolio` tinyint(4) NOT NULL DEFAULT 0,
  `user_testimonial` tinyint(4) NOT NULL DEFAULT 0,
  `user_counterInformation` tinyint(4) NOT NULL DEFAULT 0,
  `user_Brand` tinyint(4) NOT NULL DEFAULT 0,
  `user_social` tinyint(4) NOT NULL DEFAULT 0,
  `user_whychooseus` tinyint(4) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_subscribers`
--

CREATE TABLE `user_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_testimonials`
--

CREATE TABLE `user_testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `serial_number` int(11) NOT NULL DEFAULT 0,
  `lang_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_themes`
--

CREATE TABLE `user_themes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `theme_id` varchar(255) NOT NULL,
  `purchased_at` timestamp NOT NULL,
  `status` enum('pending','active','rejected') NOT NULL DEFAULT 'pending',
  `payment_ref` varchar(255) DEFAULT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'SAR',
  `payment_method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_vcards`
--

CREATE TABLE `user_vcards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `template` tinyint(4) NOT NULL DEFAULT 1 COMMENT 'number represents the template number',
  `direction` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 - ltr, 2 - rtl',
  `profile_image` varchar(50) DEFAULT NULL,
  `cover_image` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website_url` text DEFAULT NULL,
  `introduction` text DEFAULT NULL,
  `information` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `vcard_name` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `video` text DEFAULT NULL,
  `preferences` text DEFAULT NULL,
  `call_button_color` varchar(20) NOT NULL DEFAULT 'ed2476',
  `whatsapp_button_color` varchar(20) NOT NULL DEFAULT '25d366',
  `mail_button_color` varchar(20) NOT NULL DEFAULT 'BB001B',
  `add_to_contact_button_color` varchar(20) NOT NULL DEFAULT 'FF5C58',
  `share_vcard_button_color` varchar(20) NOT NULL DEFAULT 'FF5C58',
  `phone_icon_color` varchar(20) NOT NULL DEFAULT 'FFB830',
  `email_icon_color` varchar(20) NOT NULL DEFAULT 'FFB830',
  `address_icon_color` varchar(20) NOT NULL DEFAULT 'FFB830',
  `website_url_icon_color` varchar(20) NOT NULL DEFAULT 'FFB830',
  `keywords` text DEFAULT NULL,
  `base_color` varchar(10) NOT NULL DEFAULT 'fa2859',
  `summary_background_color` varchar(10) NOT NULL DEFAULT 'FFEEED',
  `preview_template` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 == yes, 0== no',
  `template_img` varchar(255) DEFAULT NULL,
  `template_serial_number` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0= hide, 1=show',
  `template_name` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_vcard_projects`
--

CREATE TABLE `user_vcard_projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_vcard_id` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `short_details` text DEFAULT NULL,
  `external_link_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - active, 0 - deactive',
  `external_link` text DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_vcard_services`
--

CREATE TABLE `user_vcard_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_vcard_id` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `short_details` text DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `external_link_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1 - active, 0 - deactive',
  `external_link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_vcard_testimonials`
--

CREATE TABLE `user_vcard_testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_vcard_id` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL,
  `serial_number` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_work_processes`
--

CREATE TABLE `user_work_processes` (
  `id` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `serial_number` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user__course_coupons`
--

CREATE TABLE `user__course_coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `value` decimal(8,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `courses` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `device_type` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `country_code` varchar(2) DEFAULT NULL,
  `region_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_addons`
--

CREATE TABLE `whatsapp_addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `whatsapp_number_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `qty` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `expire_date` timestamp NULL DEFAULT NULL,
  `payment_ref` varchar(255) NOT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_addons_audit`
--

CREATE TABLE `whatsapp_addons_audit` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `whatsapp_addon_id` bigint(20) UNSIGNED DEFAULT NULL,
  `whatsapp_number_id` bigint(20) UNSIGNED DEFAULT NULL,
  `entity_type` enum('addon','number') NOT NULL DEFAULT 'addon',
  `changed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `old_status` enum('pending','approved','rejected') DEFAULT NULL,
  `new_status` enum('pending','approved','rejected') NOT NULL,
  `note` text DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_addon_plans`
--

CREATE TABLE `whatsapp_addon_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT 1,
  `duration_unit` enum('day','month','year') NOT NULL DEFAULT 'month',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_conversations`
--

CREATE TABLE `whatsapp_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `whatsapp_user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `status` enum('collecting','processed','archived') NOT NULL DEFAULT 'collecting',
  `last_message_at` timestamp NULL DEFAULT NULL,
  `message_count` int(11) NOT NULL DEFAULT 0,
  `is_real_estate_inquiry` tinyint(1) NOT NULL DEFAULT 0,
  `inquiry_type` varchar(20) DEFAULT NULL,
  `property_type` varchar(30) DEFAULT NULL,
  `budget_min` decimal(15,2) DEFAULT NULL,
  `budget_max` decimal(15,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `bedrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `bathrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `urgency` varchar(20) DEFAULT NULL,
  `furnished` tinyint(1) DEFAULT NULL,
  `ai_summary` text DEFAULT NULL,
  `extracted_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extracted_data`)),
  `inquiry_id` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_messages`
--

CREATE TABLE `whatsapp_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `whatsapp_message_id` varchar(100) DEFAULT NULL,
  `message_type` enum('text','image','document','audio','video','location','reaction') DEFAULT 'text',
  `content` text DEFAULT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `raw_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_payload`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_templates`
--

CREATE TABLE `whatsapp_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL DEFAULT 'ar',
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `character_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_users`
--

CREATE TABLE `whatsapp_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` enum('active','inactive','blocked','not_linked') DEFAULT 'active',
  `request_status` enum('active','pending','rejected') NOT NULL DEFAULT 'pending',
  `token` varchar(255) DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `token_expires_at` timestamp NULL DEFAULT NULL,
  `phone_id` varchar(255) DEFAULT NULL,
  `business_id` varchar(255) DEFAULT NULL,
  `waba_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_uuid_unique` (`uuid`);

--
-- Indexes for table `admin_articles`
--
ALTER TABLE `admin_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_articles_slug_unique` (`slug`),
  ADD KEY `admin_articles_slug_index` (`slug`),
  ADD KEY `admin_articles_category_id_index` (`category_id`),
  ADD KEY `admin_articles_admin_id_index` (`admin_id`),
  ADD KEY `admin_articles_status_index` (`status`),
  ADD KEY `admin_articles_published_at_index` (`published_at`),
  ADD KEY `admin_articles_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `admin_articles_categories`
--
ALTER TABLE `admin_articles_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_articles_categories_slug_unique` (`slug`),
  ADD KEY `admin_articles_categories_slug_index` (`slug`),
  ADD KEY `admin_articles_categories_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `admin_crm_cards`
--
ALTER TABLE `admin_crm_cards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_crm_cards_uuid_unique` (`uuid`),
  ADD UNIQUE KEY `admin_crm_cards_slug_unique` (`slug`);

--
-- Indexes for table `admin_impersonations`
--
ALTER TABLE `admin_impersonations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_id` (`admin_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_started_at` (`started_at`),
  ADD KEY `idx_admin_status` (`admin_id`,`status`),
  ADD KEY `idx_user_status` (`user_id`,`status`),
  ADD KEY `admin_impersonations_token_id_foreign` (`token_id`);

--
-- Indexes for table `affiliate_transactions`
--
ALTER TABLE `affiliate_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `affiliate_transactions_affiliate_id_foreign` (`affiliate_id`),
  ADD KEY `affiliate_transactions_type_index` (`type`),
  ADD KEY `affiliate_transactions_referral_user_id_foreign` (`referral_user_id`);

--
-- Indexes for table `analytics_daily_summary`
--
ALTER TABLE `analytics_daily_summary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `analytics_tenant_date_unique` (`tenant_id`,`date`),
  ADD KEY `analytics_lookup` (`tenant_id`,`date`),
  ADD KEY `analytics_daily_summary_tenant_id_index` (`tenant_id`),
  ADD KEY `analytics_daily_summary_date_index` (`date`);

--
-- Indexes for table `api_about_settings`
--
ALTER TABLE `api_about_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_about_settings_user_id_foreign` (`user_id`);

--
-- Indexes for table `api_affiliate_users`
--
ALTER TABLE `api_affiliate_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_affiliate_users_user_id_unique` (`user_id`),
  ADD KEY `api_affiliate_users_user_id_index` (`user_id`);

--
-- Indexes for table `api_apps`
--
ALTER TABLE `api_apps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `api_banner_settings`
--
ALTER TABLE `api_banner_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_banner_settings_user_id_foreign` (`user_id`);

--
-- Indexes for table `api_categories`
--
ALTER TABLE `api_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_categories_slug_unique` (`slug`);

--
-- Indexes for table `api_content_sections`
--
ALTER TABLE `api_content_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_content_sections_section_id_unique` (`section_id`);

--
-- Indexes for table `api_customers`
--
ALTER TABLE `api_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_phone` (`user_id`,`phone_number`),
  ADD UNIQUE KEY `unique_user_email` (`user_id`,`email`),
  ADD UNIQUE KEY `unique_phone_per_tenant` (`user_id`,`phone_number`),
  ADD KEY `api_customers_stage_id_foreign` (`stage_id`),
  ADD KEY `api_customers_procedure_id_foreign` (`procedure_id`),
  ADD KEY `api_customers_user_id_type_id_index` (`user_id`,`type_id`),
  ADD KEY `api_customers_user_id_priority_id_index` (`user_id`,`priority_id`),
  ADD KEY `api_customers_type_id_foreign` (`type_id`),
  ADD KEY `api_customers_priority_id_foreign` (`priority_id`),
  ADD KEY `api_customers_created_by_type_created_by_id_index` (`created_by_type`,`created_by_id`),
  ADD KEY `api_customers_phone_number_index` (`phone_number`),
  ADD KEY `api_customers_source_id_index` (`source_id`),
  ADD KEY `api_customers_property_request_id_index` (`property_request_id`),
  ADD KEY `api_customers_user_id_index` (`user_id`),
  ADD KEY `api_customers_user_created_index` (`user_id`,`created_at`),
  ADD KEY `api_customers_user_stage_index` (`user_id`,`stage_id`),
  ADD KEY `api_customers_user_priority_index` (`user_id`,`priority_id`),
  ADD KEY `api_customers_user_procedure_index` (`user_id`,`procedure_id`),
  ADD KEY `api_customers_user_type_index` (`user_id`,`type_id`),
  ADD KEY `api_customers_responsible_employee_index` (`responsible_employee_id`),
  ADD KEY `api_customers_pr_user_employee_index` (`property_request_id`,`user_id`,`responsible_employee_id`);

--
-- Indexes for table `api_customer_dropdown_settings`
--
ALTER TABLE `api_customer_dropdown_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_customer_dropdown_settings_user_id_unique` (`user_id`);

--
-- Indexes for table `api_customer_inquiry`
--
ALTER TABLE `api_customer_inquiry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_customer_inquiry_customer_id_index` (`customer_id`),
  ADD KEY `api_customer_inquiry_user_id_index` (`user_id`),
  ADD KEY `api_customer_inquiry_customer_created_index` (`customer_id`,`created_at`),
  ADD KEY `aci_user_read_idx` (`user_id`,`is_read`),
  ADD KEY `aci_user_archived_idx` (`user_id`,`is_archived`);

--
-- Indexes for table `api_customer_property_interested`
--
ALTER TABLE `api_customer_property_interested`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_customer_property_interested_user_id_index` (`user_id`),
  ADD KEY `api_customer_property_interested_customer_id_index` (`customer_id`),
  ADD KEY `api_customer_property_interested_property_id_index` (`property_id`),
  ADD KEY `api_customer_property_interested_category_id_index` (`category_id`),
  ADD KEY `api_customer_property_interested_customer_index` (`customer_id`),
  ADD KEY `api_customer_property_interested_customer_category_index` (`customer_id`,`category_id`),
  ADD KEY `api_customer_property_interested_customer_property_index` (`customer_id`,`property_id`),
  ADD KEY `api_cpi_customer_category_index` (`customer_id`,`category_id`),
  ADD KEY `api_cpi_customer_property_index` (`customer_id`,`property_id`),
  ADD KEY `api_cpi_user_customer_index` (`user_id`,`customer_id`);

--
-- Indexes for table `api_domains_settings`
--
ALTER TABLE `api_domains_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_domains_settings_custom_name_unique` (`custom_name`),
  ADD KEY `api_domains_settings_user_id_foreign` (`user_id`),
  ADD KEY `api_domains_settings_custom_domain_id_foreign` (`custom_domain_id`),
  ADD KEY `idx_domains_user_status` (`user_id`,`status`);

--
-- Indexes for table `api_employee_activity_logs`
--
ALTER TABLE `api_employee_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_actlog_idx` (`user_id`,`action`,`target_type`,`target_id`),
  ADD KEY `emp_activity_tenant_employee_idx` (`user_id`,`actor_type`,`actor_id`),
  ADD KEY `emp_activity_tenant_employee_time_idx` (`user_id`,`actor_type`,`actor_id`,`created_at`);

--
-- Indexes for table `api_footer_settings`
--
ALTER TABLE `api_footer_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_footer_settings_user_id_foreign` (`user_id`);

--
-- Indexes for table `api_general_settings`
--
ALTER TABLE `api_general_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_general_settings_user_id_foreign` (`user_id`);

--
-- Indexes for table `api_installations`
--
ALTER TABLE `api_installations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_installations_user_id_app_id_unique` (`user_id`,`app_id`),
  ADD KEY `api_installations_app_id_foreign` (`app_id`),
  ADD KEY `api_installations_status_index` (`status`);

--
-- Indexes for table `api_installation_settings`
--
ALTER TABLE `api_installation_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_installation_settings_installation_id_foreign` (`installation_id`);

--
-- Indexes for table `api_media`
--
ALTER TABLE `api_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_media_user_id_foreign` (`user_id`),
  ADD KEY `api_media_mediable_type_mediable_id_index` (`mediable_type`,`mediable_id`);

--
-- Indexes for table `api_menu_items`
--
ALTER TABLE `api_menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_menu_items_user_id_foreign` (`user_id`),
  ADD KEY `api_menu_items_parent_id_foreign` (`parent_id`),
  ADD KEY `api_menu_items_user_url_active_index` (`user_id`,`url`,`is_active`);

--
-- Indexes for table `api_menu_settings`
--
ALTER TABLE `api_menu_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_menu_settings_user_id_foreign` (`user_id`);

--
-- Indexes for table `api_model_has_permissions`
--
ALTER TABLE `api_model_has_permissions`
  ADD PRIMARY KEY (`team_id`,`permission_id`,`model_id`,`model_type`),
  ADD KEY `api_model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  ADD KEY `api_model_has_permissions_permission_id_foreign` (`permission_id`),
  ADD KEY `api_model_has_permissions_team_foreign_key_index` (`team_id`);

--
-- Indexes for table `api_model_has_roles`
--
ALTER TABLE `api_model_has_roles`
  ADD PRIMARY KEY (`team_id`,`role_id`,`model_id`,`model_type`),
  ADD KEY `api_model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  ADD KEY `api_model_has_roles_role_id_foreign` (`role_id`),
  ADD KEY `api_model_has_roles_team_foreign_key_index` (`team_id`);

--
-- Indexes for table `api_permissions`
--
ALTER TABLE `api_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_permissions_name_guard_name_team_id_unique` (`name`,`guard_name`,`team_id`),
  ADD KEY `api_permissions_team_id_guard_name_index` (`team_id`,`guard_name`);

--
-- Indexes for table `api_pixels`
--
ALTER TABLE `api_pixels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_pixels_user_id_platform_unique` (`user_id`,`platform`),
  ADD KEY `api_pixels_user_id_index` (`user_id`),
  ADD KEY `api_pixels_platform_index` (`platform`),
  ADD KEY `api_pixels_is_active_index` (`is_active`);

--
-- Indexes for table `api_posts`
--
ALTER TABLE `api_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_posts_slug_unique` (`slug`),
  ADD KEY `api_posts_user_id_foreign` (`user_id`),
  ADD KEY `api_posts_status_index` (`status`),
  ADD KEY `api_posts_published_at_index` (`published_at`),
  ADD KEY `api_posts_thumbnail_id_index` (`thumbnail_id`);

--
-- Indexes for table `api_post_categories`
--
ALTER TABLE `api_post_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_post_categories_post_id_category_id_unique` (`post_id`,`category_id`),
  ADD KEY `api_post_categories_post_id_index` (`post_id`),
  ADD KEY `api_post_categories_category_id_index` (`category_id`);

--
-- Indexes for table `api_roles`
--
ALTER TABLE `api_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_roles_team_id_name_guard_name_unique` (`team_id`,`name`,`guard_name`),
  ADD KEY `api_roles_team_foreign_key_index` (`team_id`);

--
-- Indexes for table `api_role_has_permissions`
--
ALTER TABLE `api_role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `api_role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `api_sidebar_items`
--
ALTER TABLE `api_sidebar_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_sidebar_items_order_index` (`order`),
  ADD KEY `api_sidebar_items_is_active_index` (`is_active`);

--
-- Indexes for table `api_themes_settings`
--
ALTER TABLE `api_themes_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_themes_settings_theme_id_unique` (`theme_id`);

--
-- Indexes for table `api_user_categories`
--
ALTER TABLE `api_user_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_user_categories_slug_unique` (`slug`),
  ADD KEY `api_user_categories_is_active_index` (`is_active`),
  ADD KEY `api_user_categories_type_index` (`type`);

--
-- Indexes for table `api_user_category_settings`
--
ALTER TABLE `api_user_category_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_category_settings_user_id_category_id_unique` (`user_id`,`category_id`),
  ADD KEY `api_user_category_settings_category_id_foreign` (`category_id`);

--
-- Indexes for table `app_payment_transactions`
--
ALTER TABLE `app_payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `app_payment_transactions_payment_transaction_id_unique` (`payment_transaction_id`),
  ADD KEY `app_payment_transactions_user_id_status_index` (`user_id`,`status`),
  ADD KEY `app_payment_transactions_installation_id_status_index` (`installation_id`,`status`),
  ADD KEY `app_payment_transactions_app_id_status_index` (`app_id`,`status`),
  ADD KEY `app_payment_transactions_created_at_index` (`created_at`),
  ADD KEY `app_payment_transactions_status_created_at_index` (`status`,`created_at`),
  ADD KEY `app_payment_transactions_user_id_index` (`user_id`),
  ADD KEY `app_payment_transactions_installation_id_index` (`installation_id`),
  ADD KEY `app_payment_transactions_app_id_index` (`app_id`),
  ADD KEY `app_payment_transactions_status_index` (`status`);

--
-- Indexes for table `app_requests`
--
ALTER TABLE `app_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_requests_user_id_foreign` (`user_id`),
  ADD KEY `app_requests_app_id_foreign` (`app_id`);

--
-- Indexes for table `basic_extendeds`
--
ALTER TABLE `basic_extendeds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `basic_settings`
--
ALTER TABLE `basic_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bcategories`
--
ALTER TABLE `bcategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_customer_id_foreign` (`customer_id`),
  ADD KEY `bookings_property_id_foreign` (`property_id`),
  ADD KEY `bookings_user_id_foreign` (`user_id`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buildings_user_id_foreign` (`user_id`),
  ADD KEY `buildings_name_index` (`name`);

--
-- Indexes for table `card_logs`
--
ALTER TABLE `card_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_logs_tenant_id_card_id_index` (`tenant_id`,`card_id`),
  ADD KEY `card_logs_tenant_id_action_index` (`tenant_id`,`action`),
  ADD KEY `card_logs_tenant_id_created_at_index` (`tenant_id`,`created_at`);

--
-- Indexes for table `chat_histories`
--
ALTER TABLE `chat_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_histories_user_id_index` (`user_id`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contracts_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credit_packages`
--
ALTER TABLE `credit_packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `credit_packages_is_active_sort_order_index` (`is_active`,`sort_order`),
  ADD KEY `credit_packages_is_popular_index` (`is_popular`);

--
-- Indexes for table `credit_transactions`
--
ALTER TABLE `credit_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `credit_transactions_user_id_transaction_type_index` (`user_id`,`transaction_type`),
  ADD KEY `credit_transactions_user_id_status_index` (`user_id`,`status`),
  ADD KEY `credit_transactions_payment_transaction_id_index` (`payment_transaction_id`),
  ADD KEY `credit_transactions_created_at_index` (`created_at`),
  ADD KEY `credit_transactions_reference_number_index` (`reference_number`),
  ADD KEY `credit_transactions_created_by_foreign` (`created_by`),
  ADD KEY `credit_transactions_user_id_index` (`user_id`),
  ADD KEY `credit_transactions_credit_package_id_index` (`credit_package_id`);

--
-- Indexes for table `crm_cards`
--
ALTER TABLE `crm_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crm_cards_user_id_index` (`user_id`),
  ADD KEY `crm_cards_card_customer_id_index` (`card_customer_id`),
  ADD KEY `crm_cards_card_procedure_index` (`card_procedure`),
  ADD KEY `crm_cards_card_date_index` (`card_date`),
  ADD KEY `crm_cards_card_request_id_index` (`card_request_id`);

--
-- Indexes for table `crm_requests`
--
ALTER TABLE `crm_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crm_requests_user_id_index` (`user_id`),
  ADD KEY `crm_requests_stage_id_index` (`stage_id`),
  ADD KEY `crm_requests_property_id_index` (`property_id`),
  ADD KEY `crm_requests_customer_id_index` (`customer_id`),
  ADD KEY `crm_requests_customer_user_index` (`customer_id`,`user_id`),
  ADD KEY `crm_requests_user_stage_index` (`user_id`,`stage_id`),
  ADD KEY `crm_requests_user_stage_position_index` (`user_id`,`stage_id`,`position`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_logs`
--
ALTER TABLE `customer_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_logs_tenant_id_customer_id_index` (`tenant_id`,`customer_id`),
  ADD KEY `customer_logs_tenant_id_action_index` (`tenant_id`,`action`),
  ADD KEY `customer_logs_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `customer_wish_lists`
--
ALTER TABLE `customer_wish_lists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domain_renewal_pricings`
--
ALTER TABLE `domain_renewal_pricings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_domain_period` (`custom_domain_id`,`period_key`,`active`),
  ADD KEY `idx_registrar_period` (`registrar`,`period_key`,`active`),
  ADD KEY `idx_dates` (`starts_at`,`ends_at`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `embeddings`
--
ALTER TABLE `embeddings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_addons`
--
ALTER TABLE `employee_addons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_addons_payment_ref_unique` (`payment_ref`),
  ADD KEY `employee_addons_user_id_foreign` (`user_id`),
  ADD KEY `employee_addons_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `employee_addon_plans`
--
ALTER TABLE `employee_addon_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `governorates`
--
ALTER TABLE `governorates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `governorates_region_id_foreign` (`region_id`);

--
-- Indexes for table `isthara`
--
ALTER TABLE `isthara`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_contents`
--
ALTER TABLE `item_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_images`
--
ALTER TABLE `item_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_reviews`
--
ALTER TABLE `item_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_applications_user_id_index` (`user_id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leads_uuid_unique` (`uuid`),
  ADD KEY `leads_converted_user_id_foreign` (`converted_user_id`),
  ADD KEY `leads_email_index` (`email`),
  ADD KEY `leads_status_index` (`status`),
  ADD KEY `leads_source_index` (`source`),
  ADD KEY `leads_stage_id_index` (`stage_id`),
  ADD KEY `leads_assigned_admin_id_index` (`assigned_admin_id`);

--
-- Indexes for table `lead_activities`
--
ALTER TABLE `lead_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lead_activities_lead_id_index` (`lead_id`),
  ADD KEY `lead_activities_admin_id_index` (`admin_id`),
  ADD KEY `lead_activities_type_index` (`type`),
  ADD KEY `lead_activities_scheduled_at_index` (`scheduled_at`);

--
-- Indexes for table `marketing_channels`
--
ALTER TABLE `marketing_channels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketing_channels_user_id_type_index` (`user_id`,`type`),
  ADD KEY `marketing_channels_user_id_is_connected_index` (`user_id`,`is_connected`),
  ADD KEY `marketing_channels_user_id_is_verified_index` (`user_id`,`is_verified`),
  ADD KEY `marketing_channels_user_id_index` (`user_id`);

--
-- Indexes for table `marketing_channel_pricing`
--
ALTER TABLE `marketing_channel_pricing`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `marketing_channel_pricing_channel_type_unique` (`channel_type`),
  ADD KEY `marketing_channel_pricing_channel_type_is_active_index` (`channel_type`,`is_active`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberships_user_id_foreign` (`user_id`),
  ADD KEY `memberships_user_status_id_index` (`user_id`,`status`,`id`),
  ADD KEY `memberships_user_expire_index` (`user_id`,`expire_date`),
  ADD KEY `memberships_user_id_index` (`user_id`,`id`),
  ADD KEY `idx_memberships_user_expire` (`user_id`,`expire_date`),
  ADD KEY `idx_memberships_package_expire` (`package_id`,`expire_date`);

--
-- Indexes for table `membership_change_logs`
--
ALTER TABLE `membership_change_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `membership_change_logs_user_id_action_created_at_index` (`user_id`,`action`,`created_at`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offline_gateways`
--
ALTER TABLE `offline_gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `owner_rentals`
--
ALTER TABLE `owner_rentals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_rentals_email_unique` (`email`),
  ADD KEY `owner_rentals_user_id_index` (`user_id`),
  ADD KEY `owner_rentals_email_index` (`email`),
  ADD KEY `owner_rentals_is_active_index` (`is_active`);

--
-- Indexes for table `owner_rental_property`
--
ALTER TABLE `owner_rental_property`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `owner_rental_property_owner_rental_id_property_id_unique` (`owner_rental_id`,`property_id`),
  ADD KEY `owner_rental_property_owner_rental_id_index` (`owner_rental_id`),
  ADD KEY `owner_rental_property_property_id_index` (`property_id`),
  ADD KEY `owner_rental_property_user_id_index` (`user_id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pageview_analytics`
--
ALTER TABLE `pageview_analytics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_tenant_path_date` (`tenant_id`,`page_path`,`date_bucket`),
  ADD UNIQUE KEY `unique_tenant_page_date` (`tenant_id`,`page_slug`,`dynamic_slug`,`date_bucket`),
  ADD KEY `idx_tenant_date` (`tenant_id`,`date_bucket`),
  ADD KEY `idx_tenant_type_date` (`tenant_id`,`page_type`,`date_bucket`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `password_reset_logs`
--
ALTER TABLE `password_reset_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `payment_gateways`
--
ALTER TABLE `payment_gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_invoices`
--
ALTER TABLE `payment_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `popups`
--
ALTER TABLE `popups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `popups_language_id_foreign` (`language_id`);

--
-- Indexes for table `processes`
--
ALTER TABLE `processes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_logs`
--
ALTER TABLE `project_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_logs_tenant_id_project_id_index` (`tenant_id`,`project_id`),
  ADD KEY `project_logs_tenant_id_action_index` (`tenant_id`,`action`);

--
-- Indexes for table `property_logs`
--
ALTER TABLE `property_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_logs_tenant_id_property_id_index` (`tenant_id`,`property_id`),
  ADD KEY `property_logs_tenant_id_action_index` (`tenant_id`,`action`);

--
-- Indexes for table `property_matches`
--
ALTER TABLE `property_matches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_req_prop` (`user_id`,`request_type`,`request_id`,`property_id`),
  ADD KEY `idx_req` (`request_type`,`request_id`),
  ADD KEY `idx_prop` (`property_id`),
  ADD KEY `idx_score` (`match_score`),
  ADD KEY `idx_pm_user` (`user_id`),
  ADD KEY `idx_pm_user_customer` (`user_id`,`customer_key`);

--
-- Indexes for table `property_request_auto_customer_settings`
--
ALTER TABLE `property_request_auto_customer_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_request_auto_customer_settings_user_id_unique` (`user_id`),
  ADD KEY `property_request_auto_customer_settings_default_stage_id_foreign` (`default_stage_id`),
  ADD KEY `idx_enabled_lookup` (`user_id`,`auto_create_customer`);

--
-- Indexes for table `property_request_statuses`
--
ALTER TABLE `property_request_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_request_statuses_slug_unique` (`slug`);

--
-- Indexes for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_requests_request_number_unique` (`request_number`),
  ADD KEY `purchase_requests_property_id_foreign` (`property_id`),
  ADD KEY `purchase_requests_project_id_foreign` (`project_id`),
  ADD KEY `purchase_requests_overall_status_priority_index` (`overall_status`,`priority`),
  ADD KEY `purchase_requests_request_date_index` (`request_date`),
  ADD KEY `purchase_requests_assigned_to_index` (`assigned_to`),
  ADD KEY `purchase_requests_user_id_index` (`user_id`);

--
-- Indexes for table `purchase_request_stages`
--
ALTER TABLE `purchase_request_stages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_request_stages_purchase_request_id_stage_name_unique` (`purchase_request_id`,`stage_name`),
  ADD KEY `purchase_request_stages_updated_by_foreign` (`updated_by`),
  ADD KEY `purchase_request_stages_purchase_request_id_stage_order_index` (`purchase_request_id`,`stage_order`),
  ADD KEY `purchase_request_stages_status_index` (`status`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_reminder_type_id` (`reminder_type_id`),
  ADD KEY `idx_datetime` (`datetime`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- Indexes for table `reminder_types`
--
ALTER TABLE `reminder_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reminder_types_user_name_unique` (`user_id`,`name`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_deleted_at` (`deleted_at`),
  ADD KEY `idx_is_default` (`is_default`);

--
-- Indexes for table `rental_cost_items`
--
ALTER TABLE `rental_cost_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_cost_items_rental_id_is_active_index` (`rental_id`,`is_active`),
  ADD KEY `rental_cost_items_user_id_payer_index` (`user_id`,`payer`),
  ADD KEY `rental_cost_items_user_id_index` (`user_id`),
  ADD KEY `rental_cost_items_rental_id_index` (`rental_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservations_tenant_id_index` (`tenant_id`),
  ADD KEY `reservations_property_id_index` (`property_id`),
  ADD KEY `reservations_type_index` (`type`),
  ADD KEY `reservations_status_index` (`status`);

--
-- Indexes for table `rm_contracts`
--
ALTER TABLE `rm_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_contracts_user_id_index` (`user_id`),
  ADD KEY `rm_contracts_rental_id_index` (`rental_id`),
  ADD KEY `rm_contracts_status_index` (`status`),
  ADD KEY `rm_contracts_property_id_index` (`property_id`),
  ADD KEY `rm_contracts_project_id_index` (`project_id`);

--
-- Indexes for table `rm_expenses`
--
ALTER TABLE `rm_expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_expenses_rental_id_foreign` (`rental_id`),
  ADD KEY `rm_expenses_user_id_rental_id_index` (`user_id`,`rental_id`),
  ADD KEY `rm_expenses_is_active_index` (`is_active`);

--
-- Indexes for table `rm_maintenance_tickets`
--
ALTER TABLE `rm_maintenance_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_maintenance_tickets_user_id_index` (`user_id`),
  ADD KEY `rm_maintenance_tickets_rental_id_index` (`rental_id`),
  ADD KEY `rm_maintenance_tickets_priority_index` (`priority`),
  ADD KEY `rm_maintenance_tickets_status_index` (`status`);

--
-- Indexes for table `rm_payments`
--
ALTER TABLE `rm_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_payments_rental_id_payment_type_index` (`rental_id`,`payment_type`),
  ADD KEY `rm_payments_payment_date_index` (`payment_date`),
  ADD KEY `rm_payments_user_id_index` (`user_id`),
  ADD KEY `rm_payments_rental_id_index` (`rental_id`),
  ADD KEY `rm_payments_contract_id_index` (`contract_id`),
  ADD KEY `rm_payments_installment_id_index` (`installment_id`),
  ADD KEY `rm_payments_payment_type_index` (`payment_type`),
  ADD KEY `rm_payments_cost_item_id_foreign` (`cost_item_id`),
  ADD KEY `rm_payments_rental_id_cost_item_id_index` (`rental_id`,`cost_item_id`),
  ADD KEY `rm_payments_rental_id_installment_sequence_index` (`rental_id`,`installment_sequence`),
  ADD KEY `idx_payments_installment_id` (`installment_id`);

--
-- Indexes for table `rm_payment_installments`
--
ALTER TABLE `rm_payment_installments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rm_payment_installments_contract_id_sequence_no_unique` (`contract_id`,`sequence_no`),
  ADD KEY `rm_payment_installments_user_id_index` (`user_id`),
  ADD KEY `rm_payment_installments_rental_id_index` (`rental_id`),
  ADD KEY `rm_payment_installments_contract_id_index` (`contract_id`),
  ADD KEY `rm_payment_installments_due_date_index` (`due_date`),
  ADD KEY `rm_payment_installments_status_index` (`status`),
  ADD KEY `idx_installments_due_date_status` (`due_date`,`status`),
  ADD KEY `idx_installments_rental_contract` (`rental_id`,`contract_id`,`status`);

--
-- Indexes for table `rm_reminders`
--
ALTER TABLE `rm_reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_reminders_user_id_index` (`user_id`),
  ADD KEY `rm_reminders_rental_id_index` (`rental_id`),
  ADD KEY `rm_reminders_due_on_index` (`due_on`),
  ADD KEY `rm_reminders_status_index` (`status`);

--
-- Indexes for table `rm_rentals`
--
ALTER TABLE `rm_rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_rentals_user_id_index` (`user_id`),
  ADD KEY `rm_rentals_property_id_index` (`unit_id`),
  ADD KEY `rm_rentals_tenant_phone_index` (`tenant_phone`),
  ADD KEY `rm_rentals_status_index` (`status`),
  ADD KEY `idx_rentals_user_status` (`user_id`,`status`),
  ADD KEY `idx_rentals_building_id` (`building_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_property_id_foreign` (`property_id`),
  ADD KEY `sales_user_id_foreign` (`user_id`),
  ADD KEY `sales_contract_id_foreign` (`contract_id`);

--
-- Indexes for table `seos`
--
ALTER TABLE `seos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sitemaps`
--
ALTER TABLE `sitemaps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slug_tenant_cache`
--
ALTER TABLE `slug_tenant_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug_tenant_cache_slug_unique` (`slug`),
  ADD KEY `slug_tenant_lookup` (`tenant_id`,`slug_type`),
  ADD KEY `slug_tenant_cache_tenant_id_index` (`tenant_id`),
  ADD KEY `slug_tenant_cache_cached_at_index` (`cached_at`);

--
-- Indexes for table `socials`
--
ALTER TABLE `socials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_items`
--
ALTER TABLE `subscription_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_items_subscription_id_stripe_price_unique` (`subscription_id`,`stripe_price`),
  ADD UNIQUE KEY `subscription_items_stripe_id_unique` (`stripe_id`);

--
-- Indexes for table `support_center_articles`
--
ALTER TABLE `support_center_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_center_articles_slug_unique` (`slug`),
  ADD KEY `support_center_articles_slug_index` (`slug`),
  ADD KEY `support_center_articles_category_id_index` (`category_id`),
  ADD KEY `support_center_articles_admin_id_index` (`admin_id`),
  ADD KEY `support_center_articles_status_index` (`status`),
  ADD KEY `support_center_articles_published_at_index` (`published_at`),
  ADD KEY `support_center_articles_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `support_center_categories`
--
ALTER TABLE `support_center_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_center_categories_slug_unique` (`slug`),
  ADD KEY `support_center_categories_slug_index` (`slug`),
  ADD KEY `support_center_categories_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `tenant_form_submissions`
--
ALTER TABLE `tenant_form_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_form_submissions_user_id_foreign` (`user_id`);

--
-- Indexes for table `tenant_global_components`
--
ALTER TABLE `tenant_global_components`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_global_components_user_id_unique` (`user_id`);

--
-- Indexes for table `tenant_media`
--
ALTER TABLE `tenant_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_media_user_id_foreign` (`user_id`);

--
-- Indexes for table `tenant_pages`
--
ALTER TABLE `tenant_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_pages_user_id_page_id_unique` (`user_id`,`page_id`);

--
-- Indexes for table `tenant_settings`
--
ALTER TABLE `tenant_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_settings_user_id_unique` (`user_id`);

--
-- Indexes for table `tenant_static_pages`
--
ALTER TABLE `tenant_static_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_static_pages_user_id_page_id_unique` (`user_id`,`page_id`);

--
-- Indexes for table `tenant_website_layouts`
--
ALTER TABLE `tenant_website_layouts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_website_layouts_user_id_unique` (`user_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timezones`
--
ALTER TABLE `timezones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ulinks`
--
ALTER TABLE `ulinks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_referred_by_foreign` (`referred_by`),
  ADD KEY `users_tenant_id_account_type_index` (`tenant_id`,`account_type`),
  ADD KEY `users_tenant_id_index` (`tenant_id`),
  ADD KEY `users_tenant_account_type_index` (`tenant_id`,`account_type`),
  ADD KEY `idx_users_tenant_account` (`tenant_id`,`account_type`),
  ADD KEY `idx_users_tenant_active` (`tenant_id`,`active`),
  ADD KEY `users_tenant_account_active_index` (`tenant_id`,`account_type`,`active`);

--
-- Indexes for table `users_api_customers_appointments`
--
ALTER TABLE `users_api_customers_appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_api_customers_appointments_user_id_foreign` (`user_id`),
  ADD KEY `users_api_customers_appointments_customer_id_foreign` (`customer_id`),
  ADD KEY `appointments_customer_id_index` (`customer_id`);

--
-- Indexes for table `users_api_customers_priorities`
--
ALTER TABLE `users_api_customers_priorities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_api_customers_priorities_user_id_value_unique` (`user_id`,`value`),
  ADD KEY `users_api_customers_priorities_user_id_order_index` (`user_id`,`order`);

--
-- Indexes for table `users_api_customers_procedures`
--
ALTER TABLE `users_api_customers_procedures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_api_customers_procedures_user_id_procedure_name_unique` (`user_id`,`procedure_name`),
  ADD KEY `users_api_customers_procedures_user_id_order_index` (`user_id`,`order`);

--
-- Indexes for table `users_api_customers_reminders`
--
ALTER TABLE `users_api_customers_reminders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reminders_user_customer_title_unique` (`user_id`,`customer_id`,`title`),
  ADD KEY `users_api_customers_reminders_user_id_foreign` (`user_id`),
  ADD KEY `users_api_customers_reminders_customer_id_foreign` (`customer_id`),
  ADD KEY `reminders_customer_id_index` (`customer_id`);

--
-- Indexes for table `users_api_customers_stages`
--
ALTER TABLE `users_api_customers_stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_api_customers_stages_user_id_foreign` (`user_id`),
  ADD KEY `users_api_customers_stages_user_order_index` (`user_id`,`order`);

--
-- Indexes for table `users_api_customers_types`
--
ALTER TABLE `users_api_customers_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_types_user_value` (`user_id`,`value`),
  ADD KEY `idx_types_user_order` (`user_id`,`order`);

--
-- Indexes for table `users_property_requests`
--
ALTER TABLE `users_property_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_property_requests_user_id_foreign` (`user_id`),
  ADD KEY `upr_category_id_idx` (`category_id`),
  ADD KEY `upr_city_id_idx` (`city_id`),
  ADD KEY `users_property_requests_districts_id_index` (`districts_id`),
  ADD KEY `users_property_requests_user_created_index` (`user_id`,`created_at`),
  ADD KEY `users_property_requests_status_id_foreign` (`status_id`),
  ADD KEY `upr_user_status_index` (`user_id`,`status_id`),
  ADD KEY `upr_user_id_desc_index` (`user_id`,`id`),
  ADD KEY `upr_user_phone_index` (`user_id`,`phone`),
  ADD KEY `upr_user_city_index` (`user_id`,`city_id`),
  ADD KEY `upr_user_districts_index` (`user_id`,`districts_id`),
  ADD KEY `upr_user_property_type_index` (`user_id`,`property_type`),
  ADD KEY `upr_user_archived_idx` (`user_id`,`is_archived`);

--
-- Indexes for table `user_action_sections`
--
ALTER TABLE `user_action_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_activity_logs_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `user_activity_logs_action_index` (`action`),
  ADD KEY `user_activity_logs_admin_id_index` (`admin_id`);

--
-- Indexes for table `user_amenities`
--
ALTER TABLE `user_amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_basic_settings`
--
ALTER TABLE `user_basic_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_basic_settings_user_id_index` (`user_id`);

--
-- Indexes for table `user_blogs`
--
ALTER TABLE `user_blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_blogs_user_id_foreign` (`user_id`),
  ADD KEY `user_blogs_language_id_foreign` (`language_id`),
  ADD KEY `user_blogs_category_id_foreign` (`category_id`);

--
-- Indexes for table `user_blog_categories`
--
ALTER TABLE `user_blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_blog_categories_language_id_foreign` (`language_id`);

--
-- Indexes for table `user_brands`
--
ALTER TABLE `user_brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_categories`
--
ALTER TABLE `user_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_choose_us_items`
--
ALTER TABLE `user_choose_us_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_cities`
--
ALTER TABLE `user_cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_contacts`
--
ALTER TABLE `user_contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_counter_informations`
--
ALTER TABLE `user_counter_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_countries`
--
ALTER TABLE `user_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_coupons`
--
ALTER TABLE `user_coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_courses`
--
ALTER TABLE `user_courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_categories`
--
ALTER TABLE `user_course_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_enrolments`
--
ALTER TABLE `user_course_enrolments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_faqs`
--
ALTER TABLE `user_course_faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_informations`
--
ALTER TABLE `user_course_informations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_instructors`
--
ALTER TABLE `user_course_instructors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_instructor_social_links`
--
ALTER TABLE `user_course_instructor_social_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_modules`
--
ALTER TABLE `user_course_modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_course_reviews`
--
ALTER TABLE `user_course_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_credits`
--
ALTER TABLE `user_credits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_credits_user_id_unique` (`user_id`),
  ADD KEY `user_credits_user_id_is_active_index` (`user_id`,`is_active`),
  ADD KEY `user_credits_reset_date_index` (`reset_date`),
  ADD KEY `user_credits_user_id_index` (`user_id`);

--
-- Indexes for table `user_custom_domains`
--
ALTER TABLE `user_custom_domains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_districts`
--
ALTER TABLE `user_districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_districts_city_id_index` (`city_id`);

--
-- Indexes for table `user_donations`
--
ALTER TABLE `user_donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_donation_categories`
--
ALTER TABLE `user_donation_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_donation_contents`
--
ALTER TABLE `user_donation_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_donation_details`
--
ALTER TABLE `user_donation_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_donation_settings`
--
ALTER TABLE `user_donation_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_educations`
--
ALTER TABLE `user_educations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_email_templates`
--
ALTER TABLE `user_email_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_facades`
--
ALTER TABLE `user_facades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_faqs`
--
ALTER TABLE `user_faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_features`
--
ALTER TABLE `user_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_footer_quick_links`
--
ALTER TABLE `user_footer_quick_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_footer_texts`
--
ALTER TABLE `user_footer_texts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_hero_sliders`
--
ALTER TABLE `user_hero_sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_hero_statics`
--
ALTER TABLE `user_hero_statics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_home_page_texts`
--
ALTER TABLE `user_home_page_texts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_home_sections`
--
ALTER TABLE `user_home_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_items`
--
ALTER TABLE `user_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_item_categories`
--
ALTER TABLE `user_item_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_item_contents`
--
ALTER TABLE `user_item_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_item_images`
--
ALTER TABLE `user_item_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_item_sub_categories`
--
ALTER TABLE `user_item_sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_item_variations`
--
ALTER TABLE `user_item_variations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_jcategories`
--
ALTER TABLE `user_jcategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_jobs`
--
ALTER TABLE `user_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_job_experiences`
--
ALTER TABLE `user_job_experiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_languages`
--
ALTER TABLE `user_languages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lessons`
--
ALTER TABLE `user_lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lesson_complete`
--
ALTER TABLE `user_lesson_complete`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lesson_contents`
--
ALTER TABLE `user_lesson_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lesson_content_complete`
--
ALTER TABLE `user_lesson_content_complete`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lesson_quizzes`
--
ALTER TABLE `user_lesson_quizzes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_members`
--
ALTER TABLE `user_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_menus`
--
ALTER TABLE `user_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_offer_banners`
--
ALTER TABLE `user_offer_banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_offline_gateways`
--
ALTER TABLE `user_offline_gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_orders`
--
ALTER TABLE `user_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_order_items`
--
ALTER TABLE `user_order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_pages`
--
ALTER TABLE `user_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_payment_gateways`
--
ALTER TABLE `user_payment_gateways`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_permissions_user_id_foreign` (`user_id`);

--
-- Indexes for table `user_portfolios`
--
ALTER TABLE `user_portfolios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_portfolios_user_id_foreign` (`user_id`),
  ADD KEY `user_portfolios_language_id_foreign` (`language_id`),
  ADD KEY `user_portfolios_category_id_foreign` (`category_id`);

--
-- Indexes for table `user_portfolio_categories`
--
ALTER TABLE `user_portfolio_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_portfolio_images`
--
ALTER TABLE `user_portfolio_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_projects`
--
ALTER TABLE `user_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_projects_created_by_foreign` (`created_by`);

--
-- Indexes for table `user_project_contents`
--
ALTER TABLE `user_project_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_contents_slug_idx` (`slug`),
  ADD KEY `user_project_contents_slug_index` (`slug`),
  ADD KEY `user_project_contents_project_language_index` (`project_id`,`language_id`);

--
-- Indexes for table `user_project_floorplan_imgs`
--
ALTER TABLE `user_project_floorplan_imgs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_project_gallery_imgs`
--
ALTER TABLE `user_project_gallery_imgs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_project_specifications`
--
ALTER TABLE `user_project_specifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_project_types`
--
ALTER TABLE `user_project_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_properties`
--
ALTER TABLE `user_properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_properties_category_id_foreign` (`category_id`),
  ADD KEY `user_properties_project_id_foreign` (`project_id`),
  ADD KEY `idx_properties_building_id` (`building_id`),
  ADD KEY `idx_up_region` (`region_id`),
  ADD KEY `idx_up_category` (`category_id`),
  ADD KEY `idx_up_type` (`type`),
  ADD KEY `idx_up_purpose` (`purpose`),
  ADD KEY `idx_up_price` (`price`),
  ADD KEY `idx_up_area` (`area`),
  ADD KEY `idx_up_status` (`status`),
  ADD KEY `idx_up_prop_status` (`property_status`),
  ADD KEY `user_properties_created_by_foreign` (`created_by`),
  ADD KEY `user_properties_user_id_index` (`user_id`),
  ADD KEY `user_properties_user_purpose_index` (`user_id`,`purpose`),
  ADD KEY `user_properties_user_status_index` (`user_id`,`status`),
  ADD KEY `user_properties_user_price_index` (`user_id`,`price`),
  ADD KEY `user_properties_user_area_index` (`user_id`,`area`),
  ADD KEY `user_properties_user_purpose_status_index` (`user_id`,`purpose`,`status`),
  ADD KEY `user_properties_user_price_area_index` (`user_id`,`price`,`area`),
  ADD KEY `user_properties_user_featured_reorder_index` (`user_id`,`featured`,`reorder_featured`),
  ADD KEY `user_properties_user_reorder_index` (`user_id`,`reorder`),
  ADD KEY `user_properties_user_category_index` (`user_id`,`category_id`),
  ADD KEY `user_properties_user_project_index` (`user_id`,`project_id`),
  ADD KEY `user_properties_import_batch_id_index` (`import_batch_id`),
  ADD KEY `idx_up_completion_status` (`completion_status`),
  ADD KEY `user_properties_user_completion_index` (`user_id`,`completion_status`),
  ADD KEY `user_properties_user_purpose_completion_index` (`user_id`,`purpose`,`completion_status`),
  ADD KEY `idx_user_reorder_composite` (`user_id`,`reorder_featured`,`reorder`),
  ADD KEY `idx_user_created_at` (`user_id`,`created_at`),
  ADD KEY `idx_user_created_by` (`user_id`,`created_by`);

--
-- Indexes for table `user_property_amenities`
--
ALTER TABLE `user_property_amenities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_amenities_property_id` (`property_id`),
  ADD KEY `idx_amenities_amenity_id` (`amenity_id`),
  ADD KEY `idx_amenities_property_amenity` (`property_id`,`amenity_id`);

--
-- Indexes for table `user_property_categories`
--
ALTER TABLE `user_property_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_property_characteristics`
--
ALTER TABLE `user_property_characteristics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_property_characteristics_property_id_foreign` (`property_id`),
  ADD KEY `user_property_characteristics_facade_id_foreign` (`facade_id`),
  ADD KEY `user_property_characteristics_property_id_index` (`property_id`),
  ADD KEY `idx_prop_char_private_parking` (`property_id`,`private_parking`),
  ADD KEY `idx_prop_char_elevator` (`property_id`,`elevator`),
  ADD KEY `idx_prop_char_annex` (`property_id`,`annex`),
  ADD KEY `idx_prop_char_garden` (`property_id`,`garden`),
  ADD KEY `idx_prop_char_balcony` (`property_id`,`balcony`),
  ADD KEY `idx_prop_char_basement` (`property_id`,`basement`),
  ADD KEY `idx_prop_char_majlis` (`property_id`,`majlis`),
  ADD KEY `idx_prop_char_storage_room` (`property_id`,`storage_room`),
  ADD KEY `idx_prop_char_living_room` (`property_id`,`living_room`),
  ADD KEY `idx_prop_char_dining_room` (`property_id`,`dining_room`),
  ADD KEY `idx_prop_char_maid_room` (`property_id`,`maid_room`),
  ADD KEY `idx_prop_char_driver_room` (`property_id`,`driver_room`),
  ADD KEY `idx_prop_char_swimming_pool` (`property_id`,`swimming_pool`),
  ADD KEY `idx_prop_char_kitchen` (`property_id`,`kitchen`),
  ADD KEY `idx_prop_char_floor_number` (`property_id`,`floor_number`),
  ADD KEY `idx_prop_char_floors` (`property_id`,`floors`),
  ADD KEY `idx_prop_char_bathrooms` (`property_id`,`bathrooms`),
  ADD KEY `idx_prop_char_rooms` (`property_id`,`rooms`),
  ADD KEY `idx_prop_char_building_age` (`property_id`,`building_age`);

--
-- Indexes for table `user_property_contacts`
--
ALTER TABLE `user_property_contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_property_contents`
--
ALTER TABLE `user_property_contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_property_contents_property_id_index` (`property_id`),
  ADD KEY `user_property_contents_title_index` (`title`),
  ADD KEY `user_property_contents_property_title_index` (`property_id`,`title`),
  ADD KEY `user_property_contents_slug_index` (`slug`),
  ADD KEY `user_property_contents_property_language_index` (`property_id`,`language_id`),
  ADD KEY `idx_prop_content_city` (`property_id`,`city_id`),
  ADD KEY `idx_prop_content_state` (`property_id`,`state_id`),
  ADD KEY `idx_prop_content_location` (`property_id`,`city_id`,`state_id`),
  ADD KEY `idx_prop_content_property_id_id` (`property_id`,`id`);
ALTER TABLE `user_property_contents` ADD FULLTEXT KEY `address` (`address`);
ALTER TABLE `user_property_contents` ADD FULLTEXT KEY `ft_prop_content_search` (`title`,`address`,`description`);

--
-- Indexes for table `user_property_features`
--
ALTER TABLE `user_property_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_property_request_field_settings`
--
ALTER TABLE `user_property_request_field_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_property_request_field_settings_user_id_field_key_unique` (`user_id`,`field_key`),
  ADD KEY `user_property_request_field_settings_user_id_index` (`user_id`);

--
-- Indexes for table `user_property_slider_imgs`
--
ALTER TABLE `user_property_slider_imgs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_slider_imgs_property_id` (`property_id`);

--
-- Indexes for table `user_property_specifications`
--
ALTER TABLE `user_property_specifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_property_wishlists`
--
ALTER TABLE `user_property_wishlists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_qr_codes`
--
ALTER TABLE `user_qr_codes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_quiz_scores`
--
ALTER TABLE `user_quiz_scores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_quotes`
--
ALTER TABLE `user_quotes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_quote_inputs`
--
ALTER TABLE `user_quote_inputs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_quote_input_options`
--
ALTER TABLE `user_quote_input_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_rooms`
--
ALTER TABLE `user_rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_amenities`
--
ALTER TABLE `user_room_amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_bookings`
--
ALTER TABLE `user_room_bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_categories`
--
ALTER TABLE `user_room_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_contents`
--
ALTER TABLE `user_room_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_coupons`
--
ALTER TABLE `user_room_coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_reviews`
--
ALTER TABLE `user_room_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_room_settings`
--
ALTER TABLE `user_room_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_seos`
--
ALTER TABLE `user_seos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_services`
--
ALTER TABLE `user_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_services_user_id_foreign` (`user_id`),
  ADD KEY `user_services_lang_id_foreign` (`lang_id`);

--
-- Indexes for table `user_shipping_charges`
--
ALTER TABLE `user_shipping_charges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_shop_settings`
--
ALTER TABLE `user_shop_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_skills_user_id_foreign` (`user_id`),
  ADD KEY `user_skills_language_id_foreign` (`language_id`);

--
-- Indexes for table `user_socials`
--
ALTER TABLE `user_socials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_states`
--
ALTER TABLE `user_states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_steps`
--
ALTER TABLE `user_steps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_steps_user_id_foreign` (`user_id`);

--
-- Indexes for table `user_subscribers`
--
ALTER TABLE `user_subscribers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_testimonials`
--
ALTER TABLE `user_testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_testimonials_user_id_foreign` (`user_id`),
  ADD KEY `user_testimonials_lang_id_foreign` (`lang_id`);

--
-- Indexes for table `user_themes`
--
ALTER TABLE `user_themes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_themes_user_id_theme_id_unique` (`user_id`,`theme_id`),
  ADD UNIQUE KEY `user_themes_payment_ref_unique` (`payment_ref`),
  ADD KEY `user_themes_user_id_index` (`user_id`),
  ADD KEY `user_themes_theme_id_index` (`theme_id`),
  ADD KEY `user_themes_status_index` (`status`);

--
-- Indexes for table `user_vcards`
--
ALTER TABLE `user_vcards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_vcard_projects`
--
ALTER TABLE `user_vcard_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_vcard_services`
--
ALTER TABLE `user_vcard_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_vcard_testimonials`
--
ALTER TABLE `user_vcard_testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_work_processes`
--
ALTER TABLE `user_work_processes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user__course_coupons`
--
ALTER TABLE `user__course_coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `visitors_user_id_foreign` (`user_id`);

--
-- Indexes for table `whatsapp_addons`
--
ALTER TABLE `whatsapp_addons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `whatsapp_addons_payment_ref_unique` (`payment_ref`),
  ADD KEY `whatsapp_addons_plan_id_foreign` (`plan_id`),
  ADD KEY `whatsapp_addons_whatsapp_number_id_foreign` (`whatsapp_number_id`);

--
-- Indexes for table `whatsapp_addons_audit`
--
ALTER TABLE `whatsapp_addons_audit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `whatsapp_addons_audit_changed_by_foreign` (`changed_by`),
  ADD KEY `whatsapp_addons_audit_whatsapp_addon_id_foreign` (`whatsapp_addon_id`),
  ADD KEY `whatsapp_addons_audit_whatsapp_number_id_foreign` (`whatsapp_number_id`);

--
-- Indexes for table `whatsapp_addon_plans`
--
ALTER TABLE `whatsapp_addon_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whatsapp_conversations`
--
ALTER TABLE `whatsapp_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `whatsapp_conversations_whatsapp_user_id_customer_phone_unique` (`whatsapp_user_id`,`customer_phone`),
  ADD KEY `whatsapp_conversations_user_id_index` (`user_id`),
  ADD KEY `whatsapp_conversations_whatsapp_user_id_index` (`whatsapp_user_id`),
  ADD KEY `whatsapp_conversations_customer_id_index` (`customer_id`),
  ADD KEY `whatsapp_conversations_customer_phone_index` (`customer_phone`),
  ADD KEY `whatsapp_conversations_status_index` (`status`),
  ADD KEY `whatsapp_conversations_last_message_at_index` (`last_message_at`),
  ADD KEY `whatsapp_conversations_is_real_estate_inquiry_index` (`is_real_estate_inquiry`),
  ADD KEY `whatsapp_conversations_inquiry_id_index` (`inquiry_id`);

--
-- Indexes for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `whatsapp_messages_conversation_id_index` (`conversation_id`),
  ADD KEY `whatsapp_messages_whatsapp_message_id_index` (`whatsapp_message_id`);

--
-- Indexes for table `whatsapp_templates`
--
ALTER TABLE `whatsapp_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `whatsapp_templates_name_unique` (`name`);

--
-- Indexes for table `whatsapp_users`
--
ALTER TABLE `whatsapp_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `whatsapp_users_tenant_employee_unique` (`user_id`,`employee_id`),
  ADD KEY `whatsapp_users_user_id_index` (`user_id`),
  ADD KEY `whatsapp_users_employee_id_index` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_articles`
--
ALTER TABLE `admin_articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_articles_categories`
--
ALTER TABLE `admin_articles_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_crm_cards`
--
ALTER TABLE `admin_crm_cards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_impersonations`
--
ALTER TABLE `admin_impersonations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `affiliate_transactions`
--
ALTER TABLE `affiliate_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `analytics_daily_summary`
--
ALTER TABLE `analytics_daily_summary`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_about_settings`
--
ALTER TABLE `api_about_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_affiliate_users`
--
ALTER TABLE `api_affiliate_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_apps`
--
ALTER TABLE `api_apps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_banner_settings`
--
ALTER TABLE `api_banner_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_categories`
--
ALTER TABLE `api_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_content_sections`
--
ALTER TABLE `api_content_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_customers`
--
ALTER TABLE `api_customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_customer_dropdown_settings`
--
ALTER TABLE `api_customer_dropdown_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_customer_inquiry`
--
ALTER TABLE `api_customer_inquiry`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_customer_property_interested`
--
ALTER TABLE `api_customer_property_interested`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_domains_settings`
--
ALTER TABLE `api_domains_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_employee_activity_logs`
--
ALTER TABLE `api_employee_activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_footer_settings`
--
ALTER TABLE `api_footer_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_general_settings`
--
ALTER TABLE `api_general_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_installations`
--
ALTER TABLE `api_installations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_installation_settings`
--
ALTER TABLE `api_installation_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_media`
--
ALTER TABLE `api_media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_menu_items`
--
ALTER TABLE `api_menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_menu_settings`
--
ALTER TABLE `api_menu_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_permissions`
--
ALTER TABLE `api_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_pixels`
--
ALTER TABLE `api_pixels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_posts`
--
ALTER TABLE `api_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_post_categories`
--
ALTER TABLE `api_post_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_roles`
--
ALTER TABLE `api_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_sidebar_items`
--
ALTER TABLE `api_sidebar_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_themes_settings`
--
ALTER TABLE `api_themes_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_user_categories`
--
ALTER TABLE `api_user_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_user_category_settings`
--
ALTER TABLE `api_user_category_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_payment_transactions`
--
ALTER TABLE `app_payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app_requests`
--
ALTER TABLE `app_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `basic_extendeds`
--
ALTER TABLE `basic_extendeds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `basic_settings`
--
ALTER TABLE `basic_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bcategories`
--
ALTER TABLE `bcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `card_logs`
--
ALTER TABLE `card_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_histories`
--
ALTER TABLE `chat_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `credit_packages`
--
ALTER TABLE `credit_packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `credit_transactions`
--
ALTER TABLE `credit_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crm_cards`
--
ALTER TABLE `crm_cards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crm_requests`
--
ALTER TABLE `crm_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_logs`
--
ALTER TABLE `customer_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_wish_lists`
--
ALTER TABLE `customer_wish_lists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domain_renewal_pricings`
--
ALTER TABLE `domain_renewal_pricings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `embeddings`
--
ALTER TABLE `embeddings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_addons`
--
ALTER TABLE `employee_addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_addon_plans`
--
ALTER TABLE `employee_addon_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `governorates`
--
ALTER TABLE `governorates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `isthara`
--
ALTER TABLE `isthara`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_contents`
--
ALTER TABLE `item_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_images`
--
ALTER TABLE `item_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_reviews`
--
ALTER TABLE `item_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lead_activities`
--
ALTER TABLE `lead_activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketing_channels`
--
ALTER TABLE `marketing_channels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketing_channel_pricing`
--
ALTER TABLE `marketing_channel_pricing`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `membership_change_logs`
--
ALTER TABLE `membership_change_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offline_gateways`
--
ALTER TABLE `offline_gateways`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `owner_rentals`
--
ALTER TABLE `owner_rentals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `owner_rental_property`
--
ALTER TABLE `owner_rental_property`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pageview_analytics`
--
ALTER TABLE `pageview_analytics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_logs`
--
ALTER TABLE `password_reset_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_gateways`
--
ALTER TABLE `payment_gateways`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_invoices`
--
ALTER TABLE `payment_invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `popups`
--
ALTER TABLE `popups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `processes`
--
ALTER TABLE `processes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_logs`
--
ALTER TABLE `project_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_logs`
--
ALTER TABLE `property_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_matches`
--
ALTER TABLE `property_matches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_request_auto_customer_settings`
--
ALTER TABLE `property_request_auto_customer_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_request_statuses`
--
ALTER TABLE `property_request_statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_request_stages`
--
ALTER TABLE `purchase_request_stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reminder_types`
--
ALTER TABLE `reminder_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rental_cost_items`
--
ALTER TABLE `rental_cost_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_contracts`
--
ALTER TABLE `rm_contracts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_expenses`
--
ALTER TABLE `rm_expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_maintenance_tickets`
--
ALTER TABLE `rm_maintenance_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_payments`
--
ALTER TABLE `rm_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_payment_installments`
--
ALTER TABLE `rm_payment_installments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_reminders`
--
ALTER TABLE `rm_reminders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rm_rentals`
--
ALTER TABLE `rm_rentals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seos`
--
ALTER TABLE `seos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sitemaps`
--
ALTER TABLE `sitemaps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slug_tenant_cache`
--
ALTER TABLE `slug_tenant_cache`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `socials`
--
ALTER TABLE `socials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_items`
--
ALTER TABLE `subscription_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_center_articles`
--
ALTER TABLE `support_center_articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_center_categories`
--
ALTER TABLE `support_center_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timezones`
--
ALTER TABLE `timezones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ulinks`
--
ALTER TABLE `ulinks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_appointments`
--
ALTER TABLE `users_api_customers_appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_priorities`
--
ALTER TABLE `users_api_customers_priorities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_procedures`
--
ALTER TABLE `users_api_customers_procedures`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_reminders`
--
ALTER TABLE `users_api_customers_reminders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_stages`
--
ALTER TABLE `users_api_customers_stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_api_customers_types`
--
ALTER TABLE `users_api_customers_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_property_requests`
--
ALTER TABLE `users_property_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_action_sections`
--
ALTER TABLE `user_action_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_amenities`
--
ALTER TABLE `user_amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_basic_settings`
--
ALTER TABLE `user_basic_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_blogs`
--
ALTER TABLE `user_blogs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_blog_categories`
--
ALTER TABLE `user_blog_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_brands`
--
ALTER TABLE `user_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_categories`
--
ALTER TABLE `user_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_choose_us_items`
--
ALTER TABLE `user_choose_us_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_cities`
--
ALTER TABLE `user_cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_contacts`
--
ALTER TABLE `user_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_counter_informations`
--
ALTER TABLE `user_counter_informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_countries`
--
ALTER TABLE `user_countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_coupons`
--
ALTER TABLE `user_coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_courses`
--
ALTER TABLE `user_courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_categories`
--
ALTER TABLE `user_course_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_enrolments`
--
ALTER TABLE `user_course_enrolments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_faqs`
--
ALTER TABLE `user_course_faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_informations`
--
ALTER TABLE `user_course_informations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_instructors`
--
ALTER TABLE `user_course_instructors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_instructor_social_links`
--
ALTER TABLE `user_course_instructor_social_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_modules`
--
ALTER TABLE `user_course_modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_course_reviews`
--
ALTER TABLE `user_course_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_credits`
--
ALTER TABLE `user_credits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_custom_domains`
--
ALTER TABLE `user_custom_domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_districts`
--
ALTER TABLE `user_districts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_donations`
--
ALTER TABLE `user_donations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_donation_categories`
--
ALTER TABLE `user_donation_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_donation_contents`
--
ALTER TABLE `user_donation_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_donation_details`
--
ALTER TABLE `user_donation_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_donation_settings`
--
ALTER TABLE `user_donation_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_educations`
--
ALTER TABLE `user_educations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_email_templates`
--
ALTER TABLE `user_email_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_facades`
--
ALTER TABLE `user_facades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_faqs`
--
ALTER TABLE `user_faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_features`
--
ALTER TABLE `user_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_footer_quick_links`
--
ALTER TABLE `user_footer_quick_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_footer_texts`
--
ALTER TABLE `user_footer_texts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_hero_sliders`
--
ALTER TABLE `user_hero_sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_hero_statics`
--
ALTER TABLE `user_hero_statics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_home_page_texts`
--
ALTER TABLE `user_home_page_texts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_home_sections`
--
ALTER TABLE `user_home_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_items`
--
ALTER TABLE `user_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_item_categories`
--
ALTER TABLE `user_item_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_item_contents`
--
ALTER TABLE `user_item_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_item_images`
--
ALTER TABLE `user_item_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_item_sub_categories`
--
ALTER TABLE `user_item_sub_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_item_variations`
--
ALTER TABLE `user_item_variations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_jcategories`
--
ALTER TABLE `user_jcategories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_jobs`
--
ALTER TABLE `user_jobs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_job_experiences`
--
ALTER TABLE `user_job_experiences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_languages`
--
ALTER TABLE `user_languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_lessons`
--
ALTER TABLE `user_lessons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_lesson_complete`
--
ALTER TABLE `user_lesson_complete`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_lesson_contents`
--
ALTER TABLE `user_lesson_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_lesson_content_complete`
--
ALTER TABLE `user_lesson_content_complete`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_lesson_quizzes`
--
ALTER TABLE `user_lesson_quizzes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_members`
--
ALTER TABLE `user_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_menus`
--
ALTER TABLE `user_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_offer_banners`
--
ALTER TABLE `user_offer_banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_offline_gateways`
--
ALTER TABLE `user_offline_gateways`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_orders`
--
ALTER TABLE `user_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_order_items`
--
ALTER TABLE `user_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_pages`
--
ALTER TABLE `user_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_payment_gateways`
--
ALTER TABLE `user_payment_gateways`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_portfolios`
--
ALTER TABLE `user_portfolios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_portfolio_categories`
--
ALTER TABLE `user_portfolio_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_portfolio_images`
--
ALTER TABLE `user_portfolio_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_projects`
--
ALTER TABLE `user_projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_project_contents`
--
ALTER TABLE `user_project_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_project_floorplan_imgs`
--
ALTER TABLE `user_project_floorplan_imgs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_project_gallery_imgs`
--
ALTER TABLE `user_project_gallery_imgs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_project_specifications`
--
ALTER TABLE `user_project_specifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_project_types`
--
ALTER TABLE `user_project_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_properties`
--
ALTER TABLE `user_properties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_amenities`
--
ALTER TABLE `user_property_amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_categories`
--
ALTER TABLE `user_property_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_characteristics`
--
ALTER TABLE `user_property_characteristics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_contacts`
--
ALTER TABLE `user_property_contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_contents`
--
ALTER TABLE `user_property_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_features`
--
ALTER TABLE `user_property_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_request_field_settings`
--
ALTER TABLE `user_property_request_field_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_slider_imgs`
--
ALTER TABLE `user_property_slider_imgs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_specifications`
--
ALTER TABLE `user_property_specifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_property_wishlists`
--
ALTER TABLE `user_property_wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_qr_codes`
--
ALTER TABLE `user_qr_codes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_quiz_scores`
--
ALTER TABLE `user_quiz_scores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_quotes`
--
ALTER TABLE `user_quotes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_quote_inputs`
--
ALTER TABLE `user_quote_inputs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_quote_input_options`
--
ALTER TABLE `user_quote_input_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_rooms`
--
ALTER TABLE `user_rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_amenities`
--
ALTER TABLE `user_room_amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_bookings`
--
ALTER TABLE `user_room_bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_categories`
--
ALTER TABLE `user_room_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_contents`
--
ALTER TABLE `user_room_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_coupons`
--
ALTER TABLE `user_room_coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_reviews`
--
ALTER TABLE `user_room_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_room_settings`
--
ALTER TABLE `user_room_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_seos`
--
ALTER TABLE `user_seos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_services`
--
ALTER TABLE `user_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_shipping_charges`
--
ALTER TABLE `user_shipping_charges`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_shop_settings`
--
ALTER TABLE `user_shop_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_socials`
--
ALTER TABLE `user_socials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_states`
--
ALTER TABLE `user_states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_steps`
--
ALTER TABLE `user_steps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_subscribers`
--
ALTER TABLE `user_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_testimonials`
--
ALTER TABLE `user_testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_themes`
--
ALTER TABLE `user_themes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vcards`
--
ALTER TABLE `user_vcards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vcard_projects`
--
ALTER TABLE `user_vcard_projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vcard_services`
--
ALTER TABLE `user_vcard_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_vcard_testimonials`
--
ALTER TABLE `user_vcard_testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_work_processes`
--
ALTER TABLE `user_work_processes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user__course_coupons`
--
ALTER TABLE `user__course_coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_addons`
--
ALTER TABLE `whatsapp_addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_addons_audit`
--
ALTER TABLE `whatsapp_addons_audit`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_addon_plans`
--
ALTER TABLE `whatsapp_addon_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_conversations`
--
ALTER TABLE `whatsapp_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_templates`
--
ALTER TABLE `whatsapp_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_users`
--
ALTER TABLE `whatsapp_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_articles`
--
ALTER TABLE `admin_articles`
  ADD CONSTRAINT `admin_articles_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `admin_articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `admin_articles_categories` (`id`);

--
-- Constraints for table `admin_impersonations`
--
ALTER TABLE `admin_impersonations`
  ADD CONSTRAINT `admin_impersonations_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `admin_impersonations_token_id_foreign` FOREIGN KEY (`token_id`) REFERENCES `personal_access_tokens` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_impersonations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `affiliate_transactions`
--
ALTER TABLE `affiliate_transactions`
  ADD CONSTRAINT `affiliate_transactions_affiliate_id_foreign` FOREIGN KEY (`affiliate_id`) REFERENCES `api_affiliate_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `affiliate_transactions_referral_user_id_foreign` FOREIGN KEY (`referral_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_about_settings`
--
ALTER TABLE `api_about_settings`
  ADD CONSTRAINT `api_about_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_banner_settings`
--
ALTER TABLE `api_banner_settings`
  ADD CONSTRAINT `api_banner_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_customers`
--
ALTER TABLE `api_customers`
  ADD CONSTRAINT `api_customers_priority_id_fk` FOREIGN KEY (`priority_id`) REFERENCES `users_api_customers_priorities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_priority_id_foreign` FOREIGN KEY (`priority_id`) REFERENCES `users_api_customers_priorities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_procedure_id_foreign` FOREIGN KEY (`procedure_id`) REFERENCES `users_api_customers_procedures` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_property_request_id_foreign` FOREIGN KEY (`property_request_id`) REFERENCES `users_property_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_responsible_employee_id_foreign` FOREIGN KEY (`responsible_employee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `users_api_customers_stages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_type_id_fk` FOREIGN KEY (`type_id`) REFERENCES `users_api_customers_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_customers_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `users_api_customers_types` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `api_customer_dropdown_settings`
--
ALTER TABLE `api_customer_dropdown_settings`
  ADD CONSTRAINT `api_customer_dropdown_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_customer_inquiry`
--
ALTER TABLE `api_customer_inquiry`
  ADD CONSTRAINT `api_customer_inquiry_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_customer_inquiry_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_customer_property_interested`
--
ALTER TABLE `api_customer_property_interested`
  ADD CONSTRAINT `api_customer_property_interested_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_customer_property_interested_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_customer_property_interested_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_domains_settings`
--
ALTER TABLE `api_domains_settings`
  ADD CONSTRAINT `api_domains_settings_custom_domain_id_foreign` FOREIGN KEY (`custom_domain_id`) REFERENCES `user_custom_domains` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_domains_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_employee_activity_logs`
--
ALTER TABLE `api_employee_activity_logs`
  ADD CONSTRAINT `api_employee_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_footer_settings`
--
ALTER TABLE `api_footer_settings`
  ADD CONSTRAINT `api_footer_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_general_settings`
--
ALTER TABLE `api_general_settings`
  ADD CONSTRAINT `api_general_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_installation_settings`
--
ALTER TABLE `api_installation_settings`
  ADD CONSTRAINT `api_installation_settings_installation_id_foreign` FOREIGN KEY (`installation_id`) REFERENCES `api_installations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_media`
--
ALTER TABLE `api_media`
  ADD CONSTRAINT `api_media_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_menu_items`
--
ALTER TABLE `api_menu_items`
  ADD CONSTRAINT `api_menu_items_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `api_menu_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_menu_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_menu_settings`
--
ALTER TABLE `api_menu_settings`
  ADD CONSTRAINT `api_menu_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_model_has_permissions`
--
ALTER TABLE `api_model_has_permissions`
  ADD CONSTRAINT `api_model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `api_permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_model_has_roles`
--
ALTER TABLE `api_model_has_roles`
  ADD CONSTRAINT `api_model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `api_roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_pixels`
--
ALTER TABLE `api_pixels`
  ADD CONSTRAINT `api_pixels_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_posts`
--
ALTER TABLE `api_posts`
  ADD CONSTRAINT `api_posts_thumbnail_id_foreign` FOREIGN KEY (`thumbnail_id`) REFERENCES `api_media` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `api_posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_post_categories`
--
ALTER TABLE `api_post_categories`
  ADD CONSTRAINT `api_post_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `api_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_post_categories_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `api_posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_role_has_permissions`
--
ALTER TABLE `api_role_has_permissions`
  ADD CONSTRAINT `api_role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `api_permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `api_roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `api_user_category_settings`
--
ALTER TABLE `api_user_category_settings`
  ADD CONSTRAINT `api_user_category_settings_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `api_user_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_user_category_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_payment_transactions`
--
ALTER TABLE `app_payment_transactions`
  ADD CONSTRAINT `app_payment_transactions_app_id_foreign` FOREIGN KEY (`app_id`) REFERENCES `api_apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_payment_transactions_installation_id_foreign` FOREIGN KEY (`installation_id`) REFERENCES `api_installations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_payment_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `app_requests`
--
ALTER TABLE `app_requests`
  ADD CONSTRAINT `app_requests_app_id_foreign` FOREIGN KEY (`app_id`) REFERENCES `api_apps` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `app_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `buildings`
--
ALTER TABLE `buildings`
  ADD CONSTRAINT `buildings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `credit_transactions`
--
ALTER TABLE `credit_transactions`
  ADD CONSTRAINT `credit_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `credit_transactions_credit_package_id_foreign` FOREIGN KEY (`credit_package_id`) REFERENCES `credit_packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `credit_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `crm_cards`
--
ALTER TABLE `crm_cards`
  ADD CONSTRAINT `crm_cards_card_customer_id_foreign` FOREIGN KEY (`card_customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `crm_cards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `crm_requests`
--
ALTER TABLE `crm_requests`
  ADD CONSTRAINT `crm_requests_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `crm_requests_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `users_api_customers_stages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `crm_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_logs`
--
ALTER TABLE `customer_logs`
  ADD CONSTRAINT `customer_logs_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `domain_renewal_pricings`
--
ALTER TABLE `domain_renewal_pricings`
  ADD CONSTRAINT `domain_renewal_pricings_custom_domain_id_foreign` FOREIGN KEY (`custom_domain_id`) REFERENCES `user_custom_domains` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_addons`
--
ALTER TABLE `employee_addons`
  ADD CONSTRAINT `employee_addons_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `employee_addon_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_addons_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `governorates`
--
ALTER TABLE `governorates`
  ADD CONSTRAINT `governorates_region_id_foreign` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_assigned_admin_id_foreign` FOREIGN KEY (`assigned_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_converted_user_id_foreign` FOREIGN KEY (`converted_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_stage_id_foreign` FOREIGN KEY (`stage_id`) REFERENCES `admin_crm_cards` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lead_activities`
--
ALTER TABLE `lead_activities`
  ADD CONSTRAINT `lead_activities_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lead_activities_lead_id_foreign` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketing_channels`
--
ALTER TABLE `marketing_channels`
  ADD CONSTRAINT `marketing_channels_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `memberships`
--
ALTER TABLE `memberships`
  ADD CONSTRAINT `memberships_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `membership_change_logs`
--
ALTER TABLE `membership_change_logs`
  ADD CONSTRAINT `membership_change_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `owner_rentals`
--
ALTER TABLE `owner_rentals`
  ADD CONSTRAINT `owner_rentals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `owner_rental_property`
--
ALTER TABLE `owner_rental_property`
  ADD CONSTRAINT `owner_rental_property_owner_rental_id_foreign` FOREIGN KEY (`owner_rental_id`) REFERENCES `owner_rentals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `owner_rental_property_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `owner_rental_property_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_logs`
--
ALTER TABLE `password_reset_logs`
  ADD CONSTRAINT `password_reset_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_request_auto_customer_settings`
--
ALTER TABLE `property_request_auto_customer_settings`
  ADD CONSTRAINT `property_request_auto_customer_settings_default_stage_id_foreign` FOREIGN KEY (`default_stage_id`) REFERENCES `users_api_customers_stages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `property_request_auto_customer_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD CONSTRAINT `purchase_requests_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `user_projects` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_request_stages`
--
ALTER TABLE `purchase_request_stages`
  ADD CONSTRAINT `purchase_request_stages_purchase_request_id_foreign` FOREIGN KEY (`purchase_request_id`) REFERENCES `purchase_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_request_stages_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reminders_reminder_type_id_foreign` FOREIGN KEY (`reminder_type_id`) REFERENCES `reminder_types` (`id`),
  ADD CONSTRAINT `reminders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reminder_types`
--
ALTER TABLE `reminder_types`
  ADD CONSTRAINT `reminder_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rental_cost_items`
--
ALTER TABLE `rental_cost_items`
  ADD CONSTRAINT `rental_cost_items_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rm_rentals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rental_cost_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservations_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rm_expenses`
--
ALTER TABLE `rm_expenses`
  ADD CONSTRAINT `rm_expenses_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rm_rentals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rm_expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rm_payments`
--
ALTER TABLE `rm_payments`
  ADD CONSTRAINT `rm_payments_cost_item_id_foreign` FOREIGN KEY (`cost_item_id`) REFERENCES `rental_cost_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rm_rentals`
--
ALTER TABLE `rm_rentals`
  ADD CONSTRAINT `rm_rentals_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_contract_id_foreign` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_center_articles`
--
ALTER TABLE `support_center_articles`
  ADD CONSTRAINT `support_center_articles_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `support_center_articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `support_center_categories` (`id`);

--
-- Constraints for table `tenant_form_submissions`
--
ALTER TABLE `tenant_form_submissions`
  ADD CONSTRAINT `tenant_form_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_global_components`
--
ALTER TABLE `tenant_global_components`
  ADD CONSTRAINT `tenant_global_components_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_media`
--
ALTER TABLE `tenant_media`
  ADD CONSTRAINT `tenant_media_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_pages`
--
ALTER TABLE `tenant_pages`
  ADD CONSTRAINT `tenant_pages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_settings`
--
ALTER TABLE `tenant_settings`
  ADD CONSTRAINT `tenant_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_static_pages`
--
ALTER TABLE `tenant_static_pages`
  ADD CONSTRAINT `tenant_static_pages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_website_layouts`
--
ALTER TABLE `tenant_website_layouts`
  ADD CONSTRAINT `tenant_website_layouts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_referred_by_foreign` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users_api_customers_appointments`
--
ALTER TABLE `users_api_customers_appointments`
  ADD CONSTRAINT `users_api_customers_appointments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_api_customers_appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_api_customers_priorities`
--
ALTER TABLE `users_api_customers_priorities`
  ADD CONSTRAINT `users_api_customers_priorities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_api_customers_procedures`
--
ALTER TABLE `users_api_customers_procedures`
  ADD CONSTRAINT `users_api_customers_procedures_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_api_customers_reminders`
--
ALTER TABLE `users_api_customers_reminders`
  ADD CONSTRAINT `users_api_customers_reminders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_api_customers_reminders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_api_customers_stages`
--
ALTER TABLE `users_api_customers_stages`
  ADD CONSTRAINT `users_api_customers_stages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_api_customers_types`
--
ALTER TABLE `users_api_customers_types`
  ADD CONSTRAINT `users_api_customers_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_property_requests`
--
ALTER TABLE `users_property_requests`
  ADD CONSTRAINT `users_property_requests_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `property_request_statuses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_property_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD CONSTRAINT `user_activity_logs_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_blogs`
--
ALTER TABLE `user_blogs`
  ADD CONSTRAINT `user_blogs_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `user_blog_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_blogs_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_blogs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_blog_categories`
--
ALTER TABLE `user_blog_categories`
  ADD CONSTRAINT `user_blog_categories_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_credits`
--
ALTER TABLE `user_credits`
  ADD CONSTRAINT `user_credits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_portfolios`
--
ALTER TABLE `user_portfolios`
  ADD CONSTRAINT `user_portfolios_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `user_portfolio_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_portfolios_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_portfolios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_projects`
--
ALTER TABLE `user_projects`
  ADD CONSTRAINT `user_projects_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_properties`
--
ALTER TABLE `user_properties`
  ADD CONSTRAINT `user_properties_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_properties_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `api_user_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_properties_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_properties_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `user_projects` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_property_characteristics`
--
ALTER TABLE `user_property_characteristics`
  ADD CONSTRAINT `user_property_characteristics_facade_id_foreign` FOREIGN KEY (`facade_id`) REFERENCES `user_facades` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_property_characteristics_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `user_properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_property_request_field_settings`
--
ALTER TABLE `user_property_request_field_settings`
  ADD CONSTRAINT `user_property_request_field_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_services`
--
ALTER TABLE `user_services`
  ADD CONSTRAINT `user_services_lang_id_foreign` FOREIGN KEY (`lang_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_services_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_skills_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_steps`
--
ALTER TABLE `user_steps`
  ADD CONSTRAINT `user_steps_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_testimonials`
--
ALTER TABLE `user_testimonials`
  ADD CONSTRAINT `user_testimonials_lang_id_foreign` FOREIGN KEY (`lang_id`) REFERENCES `user_languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_testimonials_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_themes`
--
ALTER TABLE `user_themes`
  ADD CONSTRAINT `user_themes_theme_id_foreign` FOREIGN KEY (`theme_id`) REFERENCES `api_themes_settings` (`theme_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_themes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `visitors`
--
ALTER TABLE `visitors`
  ADD CONSTRAINT `visitors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `whatsapp_addons`
--
ALTER TABLE `whatsapp_addons`
  ADD CONSTRAINT `whatsapp_addons_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `whatsapp_addon_plans` (`id`),
  ADD CONSTRAINT `whatsapp_addons_whatsapp_number_id_foreign` FOREIGN KEY (`whatsapp_number_id`) REFERENCES `whatsapp_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `whatsapp_addons_audit`
--
ALTER TABLE `whatsapp_addons_audit`
  ADD CONSTRAINT `whatsapp_addons_audit_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `whatsapp_addons_audit_whatsapp_addon_id_foreign` FOREIGN KEY (`whatsapp_addon_id`) REFERENCES `whatsapp_addons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `whatsapp_addons_audit_whatsapp_number_id_foreign` FOREIGN KEY (`whatsapp_number_id`) REFERENCES `whatsapp_users` (`id`);

--
-- Constraints for table `whatsapp_conversations`
--
ALTER TABLE `whatsapp_conversations`
  ADD CONSTRAINT `whatsapp_conversations_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `api_customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `whatsapp_conversations_inquiry_id_foreign` FOREIGN KEY (`inquiry_id`) REFERENCES `api_customer_inquiry` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `whatsapp_conversations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `whatsapp_conversations_whatsapp_user_id_foreign` FOREIGN KEY (`whatsapp_user_id`) REFERENCES `whatsapp_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `whatsapp_messages`
--
ALTER TABLE `whatsapp_messages`
  ADD CONSTRAINT `whatsapp_messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `whatsapp_conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `whatsapp_users`
--
ALTER TABLE `whatsapp_users`
  ADD CONSTRAINT `whatsapp_users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
