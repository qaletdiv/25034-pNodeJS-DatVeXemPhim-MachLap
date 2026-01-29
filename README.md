B1: từ folder Back-End gọi terminal => nodemon server.js
B2: tiếp tục từ folder Back-End gọi thêm terminal khác để gọi webhook xử lí tính tiền => stripe listen --forward-to localhost:3000/api/orders/webhook

B3: từ folder Front-End gọi terminal => npm run dev (là chạy được project)

=====Database Project=====

CREATE DATABASE ticketfilm;
use ticketfilm;

CREATE TABLE Users (
id INT AUTO_INCREMENT PRIMARY KEY,
facebook_id VARCHAR(255) unique,
google_id VARCHAR(255) unique,
name VARCHAR(255) NOT NULL,
password varchar(255) not null,
email VARCHAR(255) not null unique,
phone Varchar(20) unique ,
role enum("admin" , "user") default "user",
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Coupons (
id int auto_increment primary key,
codeName varchar(50) not null unique,
value int not null,
type enum("percent" , "fixed") not null,
startDate date ,
endDate date
);

CREATE TABLE Categories (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) UNIQUE NOT NULL,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Movies (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
format varchar(20) not null,
duration INT NOT NULL, -- phút
release_date DATE NOT NULL, -- ngay chieu
age INT not null,
language VARCHAR(255) not null,
name_character text ,
poster VARCHAR(255) NOT NULL,
trailer VARCHAR(255) NOT NULL,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE MovieCategories (
movieId INT,
categoryId INT,
PRIMARY KEY (movieId, categoryId),
FOREIGN KEY (movieId) REFERENCES Movies(id) ON DELETE CASCADE,
FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE Movietheaters (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
address VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Rooms (
id INT AUTO_INCREMENT PRIMARY KEY,
theaterId INT not null,
name VARCHAR(50) not null,
totalSeats INT,
FOREIGN KEY (theaterId) REFERENCES Movietheaters(id) ON DELETE CASCADE
);

CREATE TABLE Seats (
id INT AUTO_INCREMENT PRIMARY KEY,
roomId INT not null,
rowLabel CHAR(1) NOT NULL,  
 seatIndex INT NOT NULL,  
 seatNumber VARCHAR(100) not null,
type ENUM('standard','vip','couple') DEFAULT 'standard',
FOREIGN KEY (roomId) REFERENCES Rooms(id) ON DELETE CASCADE,
UNIQUE (roomId, seatNumber)
);

CREATE TABLE Showtimes (
id INT AUTO_INCREMENT PRIMARY KEY,
movieId INT not null,
roomId INT not null,
startTime DATETIME not null,
endTime DATETIME,
price DECIMAL(10,2) not null,
FOREIGN KEY (movieId) REFERENCES Movies(id),
FOREIGN KEY (roomId) REFERENCES Rooms(id),
INDEX idx_movie (movieId),
INDEX idx_room (roomId)
);

CREATE TABLE ShowtimeSeats (
id INT AUTO_INCREMENT PRIMARY KEY,
showtimeId INT NOT NULL,
seatId INT NOT NULL,
status ENUM('available','reserved','booked') DEFAULT 'available',
reservedBy INT NULL,
reservedUntil DATETIME NULL,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (showtimeId) REFERENCES Showtimes(id) ON DELETE CASCADE,
FOREIGN KEY (seatId) REFERENCES Seats(id) ON DELETE CASCADE,
FOREIGN KEY (reservedBy) REFERENCES Users(id),
UNIQUE (showtimeId, seatId),
INDEX idx_showtime (showtimeId),
INDEX idx_status (status)
);

CREATE TABLE Orders (
id INT AUTO_INCREMENT PRIMARY KEY,
userId INT NOT NULL,
showtimeId INT NOT NULL,
couponId INT NULL,
totalAmount DECIMAL(10,2) NOT NULL,
status ENUM('pending','paid','cancelled', 'refunded') DEFAULT 'pending',
expiredAt DATETIME NULL,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (userId) REFERENCES Users(id),
FOREIGN KEY (couponId) REFERENCES Coupons(id),
FOREIGN KEY (showtimeId) REFERENCES Showtimes(id),
INDEX idx_user (userId)
);

CREATE TABLE Tickets (
id INT AUTO_INCREMENT PRIMARY KEY,
orderId INT NOT NULL,
showtimeSeatId INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
status ENUM('ACTIVE','CANCELLED','REFUNDED') DEFAULT 'ACTIVE',
isActive TINYINT(1) DEFAULT 1,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
FOREIGN KEY (showtimeSeatId) REFERENCES ShowtimeSeats(id),
UNIQUE (showtimeSeatId, isActive)
);

CREATE TABLE Payments (
id INT AUTO_INCREMENT PRIMARY KEY,
orderId INT NOT NULL,
method ENUM('vnpay','momo','paypal','stripe'),
amount DECIMAL(10,2) NOT NULL,
status ENUM('pending','success','failed') DEFAULT 'pending',
transactionCode VARCHAR(255),
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (orderId) REFERENCES Orders(id)
);

CREATE TABLE Combos (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL,
image VARCHAR(255),
status TINYINT DEFAULT 1,
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE OrderCombos (
id INT AUTO_INCREMENT PRIMARY KEY,
orderId INT NOT NULL,
comboId INT NOT NULL,
quantity INT DEFAULT 1,
price DECIMAL(10,2) NOT NULL,
FOREIGN KEY (orderId) REFERENCES Orders(id)
ON DELETE CASCADE,
FOREIGN KEY (comboId) REFERENCES Combos(id),
UNIQUE (orderId, comboId)
);
