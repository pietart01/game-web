
# REGISTER
# - VERIFICATION

# LOGIN
# QUERY USER INFO
# OPEN GAME
# PLAY GAME


-- Create the user table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLoginDate DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    INDEX (username),
    INDEX (email)
);

-- Create the userVirtualCurrency table
CREATE TABLE userVirtualCurrency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    coinAmount DECIMAL(18, 2) DEFAULT 0,
    silverAmount DECIMAL(18, 2) DEFAULT 0,
    goldAmount DECIMAL(18, 2) DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (userId)
);

-- Create the userStorage table
CREATE TABLE userStorage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    silverCapacity DECIMAL(18, 2) DEFAULT 0,
    goldCapacity DECIMAL(18, 2) DEFAULT 0,
    silverStored DECIMAL(18, 2) DEFAULT 0,
    goldStored DECIMAL(18, 2) DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (userId)
);

-- Create the userTransaction table
CREATE TABLE userTransaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    transactionType ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PURCHASE', 'SALE') NOT NULL,
    currencyType ENUM('COIN', 'SILVER', 'GOLD') NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    recipientUserId INT,
    description VARCHAR(255),
    transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (userId),
    INDEX (recipientUserId)
);