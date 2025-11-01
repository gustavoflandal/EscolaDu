-- CreateTable
CREATE TABLE `Sala` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `andar` VARCHAR(20) NULL,
    `bloco` VARCHAR(20) NULL,
    `descricao` TEXT NULL,
    `recursos` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sala_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Serie` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `nome` VARCHAR(50) NOT NULL,
    `descricao` TEXT NULL,
    `ordem` INTEGER NOT NULL,
    `nivelEnsino` VARCHAR(50) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Serie_codigo_key`(`codigo`),
    UNIQUE INDEX `Serie_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feriado` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `data` DATE NOT NULL,
    `tipo` ENUM('NACIONAL', 'ESTADUAL', 'MUNICIPAL', 'ESCOLAR') NOT NULL,
    `descricao` TEXT NULL,
    `recorrente` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Feriado_data_idx`(`data`),
    INDEX `Feriado_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;