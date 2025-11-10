CREATE DATABASE IF NOT EXISTS ritcs;
USE ritcs;

CREATE TABLE admin_community_items (
    adminID int(11) NOT NULL,
    communityItemID int(11) NOT NULL,
    PRIMARY KEY (adminID, communityItemID)
);

CREATE TABLE baskets (
    basketID int(11) NOT NULL AUTO_INCREMENT,
    userID int(11) NOT NULL,
    PRIMARY KEY (basketID),
    KEY userID (userID)
);

CREATE TABLE basket_needs (
    basketID int(11) NOT NULL,
    needID int(11) NOT NULL,
    donation int(11) NOT NULL,
    PRIMARY KEY (basketID, needID)
);

CREATE TABLE community_items (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    category enum('Food','Clothing','Shelter','Medical','Education','Other') NOT NULL,
    createdAt datetime NOT NULL DEFAULT current_timestamp(),
    volunteersNeeded int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE cupboards (
    cupboardID int(11) NOT NULL AUTO_INCREMENT,
    adminID int(11) NOT NULL,
    PRIMARY KEY (cupboardID),
    KEY adminID (adminID)
);

CREATE TABLE needs (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    description text NOT NULL,
    category enum('Food','Clothing','Shelter','Medical','Education','Other') NOT NULL DEFAULT 'Other',
    priority enum('low','medium','high') NOT NULL DEFAULT 'low',
    timeSensitive tinyint(1) NOT NULL DEFAULT 0,
    contactInfo varchar(255) DEFAULT NULL,
    createdAt timestamp NULL DEFAULT current_timestamp(),
    amountDonated decimal(10,2) NOT NULL DEFAULT 0.00,
    amountNeeded decimal(10,2) NOT NULL DEFAULT 0.00,
    adminID int(11) DEFAULT NULL,
    closed tinyint(1) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY adminID (adminID)
);

CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role enum('admin','user') NOT NULL DEFAULT 'user',
    amountDonated decimal(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id)
);

CREATE TABLE user_prefs (
    userID int(11) NOT NULL,
    category enum('Food','Clothing','Shelter','Medical','Education','Other') NOT NULL,
    PRIMARY KEY (userID, category)
);
