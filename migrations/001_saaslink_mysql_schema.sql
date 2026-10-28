-- ==========================================================
-- SaaSLink Technologies Ltd - Enterprise Relational Database Schema
-- Target Engine: MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. System Settings & Configuration
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(50) PRIMARY KEY,
  `category` VARCHAR(50) NOT NULL DEFAULT 'general',
  `data` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users & Authentication
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM(
    'Super Administrator',
    'Administrator',
    'Manager',
    'Finance',
    'Sales',
    'Project Manager',
    'Content Editor',
    'Staff'
  ) NOT NULL DEFAULT 'Staff',
  `avatar_url` VARCHAR(500) NULL,
  `phone` VARCHAR(50) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Clients (CRM)
CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `company` VARCHAR(200) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `tax_id` VARCHAR(100) NULL,
  `contact_person` VARCHAR(150) NULL,
  `notes` TEXT NULL,
  `status` ENUM('Active', 'Inactive', 'Prospect') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_clients_company` (`company`),
  INDEX `idx_clients_email` (`email`),
  INDEX `idx_clients_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Leads & Inquiries
CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(64) PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `company` VARCHAR(200) NULL,
  `service_of_interest` VARCHAR(150) NULL,
  `budget_range` VARCHAR(100) NULL,
  `timeline` VARCHAR(100) NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('contact', 'quote', 'demo', 'consultation') NOT NULL DEFAULT 'contact',
  `status` ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost', 'Archived') NOT NULL DEFAULT 'New',
  `client_id` VARCHAR(64) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_type` (`type`),
  CONSTRAINT `fk_leads_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Quotations
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` VARCHAR(64) PRIMARY KEY,
  `quotation_number` VARCHAR(100) NOT NULL UNIQUE,
  `client_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(200) NOT NULL,
  `client_company` VARCHAR(200) NOT NULL,
  `client_email` VARCHAR(191) NOT NULL,
  `client_phone` VARCHAR(50) NULL,
  `client_address` TEXT NULL,
  `issue_date` DATE NOT NULL,
  `expiry_date` DATE NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `tax_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `terms` TEXT NULL,
  `status` ENUM('Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Converted to Invoice') NOT NULL DEFAULT 'Draft',
  `converted_invoice_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_quotations_number` (`quotation_number`),
  INDEX `idx_quotations_status` (`status`),
  CONSTRAINT `fk_quotations_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Quotation Line Items
CREATE TABLE IF NOT EXISTS `quotation_items` (
  `id` VARCHAR(64) PRIMARY KEY,
  `quotation_id` VARCHAR(64) NOT NULL,
  `type` ENUM('service', 'product', 'custom') NOT NULL DEFAULT 'service',
  `description` VARCHAR(500) NOT NULL,
  `quantity` DECIMAL(8, 2) NOT NULL DEFAULT 1.00,
  `unit_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_qitems_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Invoices
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(64) PRIMARY KEY,
  `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
  `quotation_id` VARCHAR(64) NULL,
  `quotation_number` VARCHAR(100) NULL,
  `client_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(200) NOT NULL,
  `client_company` VARCHAR(200) NOT NULL,
  `client_email` VARCHAR(191) NOT NULL,
  `client_address` TEXT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `tax_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `amount_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `balance_due` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `payment_instructions` TEXT NULL,
  `status` ENUM('Draft', 'Sent', 'Viewed', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled') NOT NULL DEFAULT 'Draft',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_invoices_number` (`invoice_number`),
  INDEX `idx_invoices_status` (`status`),
  CONSTRAINT `fk_invoices_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Invoice Line Items
CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` VARCHAR(64) PRIMARY KEY,
  `invoice_id` VARCHAR(64) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `quantity` DECIMAL(8, 2) NOT NULL DEFAULT 1.00,
  `unit_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_iitems_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(64) PRIMARY KEY,
  `receipt_number` VARCHAR(100) NOT NULL UNIQUE,
  `invoice_id` VARCHAR(64) NOT NULL,
  `invoice_number` VARCHAR(100) NOT NULL,
  `client_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(200) NOT NULL,
  `payment_date` DATE NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `payment_method` ENUM('Bank Transfer', 'Credit Card', 'Mobile Money / M-Pesa', 'PayPal', 'Cash / Cheque') NOT NULL,
  `payment_reference` VARCHAR(100) NOT NULL,
  `notes` TEXT NULL,
  `recorded_by` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_payments_invoice` (`invoice_id`),
  INDEX `idx_payments_receipt` (`receipt_number`),
  CONSTRAINT `fk_payments_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Receipts
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` VARCHAR(64) PRIMARY KEY,
  `receipt_number` VARCHAR(100) NOT NULL UNIQUE,
  `payment_id` VARCHAR(64) NOT NULL,
  `invoice_id` VARCHAR(64) NOT NULL,
  `invoice_number` VARCHAR(100) NOT NULL,
  `client_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(200) NOT NULL,
  `client_company` VARCHAR(200) NOT NULL,
  `payment_date` DATE NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `payment_method` VARCHAR(100) NOT NULL,
  `payment_reference` VARCHAR(100) NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_receipts_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(64) PRIMARY KEY,
  `client_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(200) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `scope` TEXT NULL,
  `start_date` DATE NOT NULL,
  `target_end_date` DATE NOT NULL,
  `status` ENUM('Planning', 'Active', 'On Hold', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Planning',
  `budget` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `progress` INT NOT NULL DEFAULT 0,
  `assigned_members` JSON NOT NULL,
  `quotation_id` VARCHAR(64) NULL,
  `invoice_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_status` (`status`),
  CONSTRAINT `fk_projects_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` VARCHAR(64) PRIMARY KEY,
  `project_id` VARCHAR(64) NOT NULL,
  `project_name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `assignee` VARCHAR(150) NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  `due_date` DATE NOT NULL,
  `status` ENUM('To Do', 'In Progress', 'Review', 'Done') NOT NULL DEFAULT 'To Do',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tasks_project` (`project_id`),
  INDEX `idx_tasks_status` (`status`),
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. CMS: Services
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` LONGTEXT NOT NULL,
  `icon_name` VARCHAR(100) NOT NULL DEFAULT 'Code2',
  `featured_image` VARCHAR(500) NULL,
  `features` JSON NOT NULL,
  `benefits` JSON NOT NULL,
  `faqs` JSON NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. CMS: Products & Platforms
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) NOT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` LONGTEXT NOT NULL,
  `logo_url` VARCHAR(500) NULL,
  `hero_image` VARCHAR(500) NULL,
  `screenshots` JSON NOT NULL,
  `features` JSON NOT NULL,
  `benefits` JSON NOT NULL,
  `industries` JSON NOT NULL,
  `tech_stack` JSON NOT NULL,
  `pricing_model` VARCHAR(255) NULL,
  `demo_url` VARCHAR(500) NULL,
  `cta_label` VARCHAR(100) DEFAULT 'Request Demo',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. CMS: Portfolio & Case Studies
CREATE TABLE IF NOT EXISTS `portfolio_projects` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `client` VARCHAR(200) NOT NULL,
  `client_logo` VARCHAR(500) NULL,
  `industry` VARCHAR(100) NOT NULL,
  `project_type` VARCHAR(100) NOT NULL,
  `status` ENUM('Completed', 'Ongoing', 'Deployed') NOT NULL DEFAULT 'Completed',
  `completion_date` VARCHAR(50) NOT NULL,
  `short_summary` TEXT NOT NULL,
  `full_case_study` LONGTEXT NOT NULL,
  `challenge` LONGTEXT NOT NULL,
  `solution` LONGTEXT NOT NULL,
  `results` JSON NOT NULL,
  `technologies` JSON NOT NULL,
  `services_provided` JSON NOT NULL,
  `project_url` VARCHAR(500) NULL,
  `featured_image` VARCHAR(500) NOT NULL,
  `gallery` JSON NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_portfolio_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. CMS: Articles & Insights
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `tags` JSON NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `author_role` VARCHAR(150) NOT NULL,
  `author_avatar` VARCHAR(500) NULL,
  `cover_image` VARCHAR(500) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `read_time` VARCHAR(50) NOT NULL DEFAULT '5 min read',
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `published_at` VARCHAR(50) NOT NULL,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_articles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Team Members
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `position` VARCHAR(150) NOT NULL,
  `bio` TEXT NOT NULL,
  `avatar_url` VARCHAR(500) NOT NULL,
  `skills` JSON NOT NULL,
  `social_links` JSON NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(64) PRIMARY KEY,
  `client_name` VARCHAR(150) NOT NULL,
  `position` VARCHAR(150) NOT NULL,
  `organization` VARCHAR(200) NOT NULL,
  `avatar_url` VARCHAR(500) NULL,
  `content` TEXT NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `related_project` VARCHAR(200) NULL,
  `display_priority` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Media Library
CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(64) PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL,
  `alt_text` VARCHAR(255) NULL,
  `caption` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Navigation
CREATE TABLE IF NOT EXISTS `navigation` (
  `id` VARCHAR(64) PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `location` ENUM('header', 'footer', 'both') NOT NULL DEFAULT 'both',
  `order` INT NOT NULL DEFAULT 0,
  `is_external` TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Audit Activity Log
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `resource_id` VARCHAR(64) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_activity_resource` (`resource`),
  INDEX `idx_activity_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
