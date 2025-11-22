-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(255) NOT NULL,
    `handle` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `logo_url` VARCHAR(500) NULL,
    `access_token` TEXT NULL,
    `authorization_code` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_handle_key`(`handle`),
    INDEX `companies_handle_idx`(`handle`),
    INDEX `companies_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
