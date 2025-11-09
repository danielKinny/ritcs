CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    amountDonated DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id)
);

CREATE TABLE needs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority ENUM('low','medium','high') NOT NULL DEFAULT 'low',
    timeSensitive TINYINT(1) NOT NULL DEFAULT 0,
    contactInfo VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amountDonated DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    amountNeeded DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    adminID INT(11),
    PRIMARY KEY (id),
    FOREIGN KEY (adminID) REFERENCES users(id)
);

CREATE TABLE baskets (
    basketID INT(11) NOT NULL AUTO_INCREMENT,
    userID INT(11) NOT NULL,
    PRIMARY KEY (basketID),
    FOREIGN KEY (userID) REFERENCES users(id)
);

CREATE TABLE basket_needs (
    basketID INT(11) NOT NULL,
    needID INT(11) NOT NULL,
    donation INT(11) NOT NULL,
    PRIMARY KEY (basketID, needID),
    FOREIGN KEY (basketID) REFERENCES baskets(basketID),
    FOREIGN KEY (needID) REFERENCES needs(id)
);

CREATE TABLE cupboards (
    cupboardID INT(11) NOT NULL AUTO_INCREMENT,
    adminID INT(11) NOT NULL,
    PRIMARY KEY (cupboardID),
    FOREIGN KEY (adminID) REFERENCES users(id)
);

CREATE TABLE cupboard_needs (
    cupboardID INT(11) NOT NULL,
    needID INT(11) NOT NULL,
    PRIMARY KEY (cupboardID, needID),
    FOREIGN KEY (cupboardID) REFERENCES cupboards(cupboardID),
    FOREIGN KEY (needID) REFERENCES needs(id)
);
