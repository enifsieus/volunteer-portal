/* ************************************************ */
/* This script must be run as a database superuser. */
/* Target database engine: MySQL 5.7.20             */
/*                                                  */
/* @author jjoseph                                  */
/* @since Nov 2017                                  */
/* ************************************************ */

/* This script creates the database used for Nyan Portal. */

/* It also creates the user that will administer it. */

/* Finally, it sets up the database schema. */

/* This script is the 'blank slate' approach to database
 * setup, in that it does NOT handle any DB migration. It
 * simply sets up the DB at the most up-to-date schema. */

/* Later on, when there is live data in production, we will
 * need to handle migration gracefully, but at this point in
 * the development process, this is not a relevant concern. */

/* ************************************************************************* */

/* The work of creating history starts with a blank page. */
DROP DATABASE IF EXISTS nyanPortal;
DROP USER IF EXISTS nyanCat;

/* In the beginning there was Nyan Cat. */
/* This is the user Node.js will connect as. */
CREATE USER  'nyanCat'@'%' IDENTIFIED WITH mysql_native_password BY 'P!b2BtW8AarP';

/* Make the DB. */
CREATE DATABASE nyanPortal 

/* widest level of Unicode support, supports emoji and Chinese */
CHARACTER SET utf8mb4;

GRANT ALL PRIVILEGES ON nyanPortal.* TO 'nyanCat'@'%';
	
USE nyanPortal;

/* ************************************************************************* */
/* Create the Thirteen Tables of Nyan */

CREATE TABLE events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128),
	edition VARCHAR(128),
	startDateTime DATETIME,
	endDateTime DATETIME,
	registrationStart DATETIME,
	registrationEnd DATETIME,
	lotteryStatus ENUM ('none', 'prereg', 'active', 'closed') NOT NULL default 'none',
	isActive BIT DEFAULT 1,
	description VARCHAR(512),
	photo VARCHAR(256)
);

CREATE TABLE teams (
	id INT AUTO_INCREMENT PRIMARY KEY,
	event INT, FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE,
	name VARCHAR(64),
	description VARCHAR(512),
	photo VARCHAR(256)
);

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(64) UNIQUE,
	password BINARY(60), /* bcrypt hashes */
	lastName VARCHAR(32),
	firstName VARCHAR(32),
	burnName VARCHAR(32),
	dateOfBirth DATE,
	isActive BIT DEFAULT 1,
	photo VARCHAR(256)
);

CREATE TABLE tickets (
	user  INT, FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
	event INT, FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE,
	firstName VARCHAR(32) NOT NULL,
	lastName  VARCHAR(32) NOT NULL,
	lastUpdate DATETIME DEFAULT NULL,
	status ENUM('none', 'waitlist', 'offered', 'ticketed', 'refused', 'lapsed', 'refunded', 'onhold') DEFAULT 'none',
	UNIQUE(user, event)
);

CREATE TABLE waitlist (
    event INT, FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE,
    user  INT, FOREIGN KEY (user) REFERENCES events(id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT -1,
    UNIQUE (user, event)
);

CREATE TABLE saleItems (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    event INT, FOREIGN KEY(event) REFERENCES events(id) ON DELETE CASCADE,
    name  VARCHAR(32),
    description VARCHAR(255),
    price DECIMAL(4,2) NOT NULL,
    currency ENUM('USD', 'CAD') NOT NULL
);

CREATE TABLE ticketOffers (
    user  INT, FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE,
    event INT, FOREIGN KEY(event) REFERENCES events(id) ON DELETE CASCADE,
    item  INT, FOREIGN KEY(item) REFERENCES saleItems(id) ON DELETE CASCADE,
    expires DATETIME,
    offerType ENUM('directed', 'lottery') NOT NULL,
    note VARCHAR (64),
    status ENUM('open','closed')
);

CREATE TABLE roles (
	id INT AUTO_INCREMENT PRIMARY KEY,
	team INT, FOREIGN KEY (team) REFERENCES teams(id) ON DELETE CASCADE,
	name VARCHAR(64)
);

CREATE TABLE qualifications (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(64),
	description VARCHAR(512)
);

CREATE TABLE shifts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	role INT, FOREIGN KEY (role) REFERENCES roles(id) ON DELETE CASCADE,
	startTime DATETIME,
	endTime DATETIME,
	minStaff INT DEFAULT 1,
	maxStaff INT DEFAULT 1
);

CREATE TABLE teamLeads (
	teamLead INT, FOREIGN KEY (teamLead) REFERENCES users(id) ON DELETE CASCADE,
	team INT, FOREIGN KEY (team) REFERENCES teams(id) ON DELETE CASCADE,
	canGrantCoLeads BIT DEFAULT 0
);

CREATE TABLE shiftAssignments (
	user INT, FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE,
	shift INT, FOREIGN KEY (shift) REFERENCES shifts(id) ON DELETE CASCADE,
	status ENUM('pending', 'fulfilled', 'noshow') DEFAULT 'pending'
);

CREATE TABLE roleHierarchy (
	supervisingRole INT, FOREIGN KEY (supervisingRole) REFERENCES roles(id) ON DELETE CASCADE,
	supervisedRole INT, FOREIGN KEY (supervisedRole) REFERENCES roles(id) ON DELETE CASCADE,
	canSetShiftStatus BIT DEFAULT 0,
	canViewSchedule BIT DEFAULT 0,
	canModifyShift BIT DEFAULT 0
);

CREATE TABLE requiredQualificationForRole (
	role INT, FOREIGN KEY (role) REFERENCES roles(id),
	qualification INT, FOREIGN KEY (qualification) REFERENCES qualifications(id) ON DELETE CASCADE
);

CREATE TABLE requiredQualificationForShift (
	shift INT, FOREIGN KEY (shift) REFERENCES shifts(id),
	qualification INT, FOREIGN KEY (qualification) REFERENCES qualifications(id) ON DELETE CASCADE
);

CREATE TABLE qualificationGranters (
	grantedQualification INT, FOREIGN KEY (grantedQualification) REFERENCES qualifications(id) ON DELETE CASCADE,
	grantingQualification INT, FOREIGN KEY (grantingQualification) REFERENCES qualifications(id) ON DELETE CASCADE,
	grantingUser INT, FOREIGN KEY (grantingUser) REFERENCES users(id),
	grantingRole INT, FOREIGN KEY (grantingRole) REFERENCES roles(id)
);

/* ************************************************************************* */
/* Grant powers to Nyan Cat over the tables of Nyan...
 * ...but not too much power! */

GRANT INSERT, SELECT, UPDATE, EXECUTE, DELETE ON nyanPortal.* TO 'nyanCat'@'%';
							