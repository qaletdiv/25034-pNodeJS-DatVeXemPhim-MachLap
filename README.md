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

INSERT INTO Coupons (codeName, value, type, startDate, endDate)
VALUES
('SALE10',10,'percent','2025-01-01','2026-12-31'),
('SALE20',20,'percent','2025-01-01','2026-12-31'),
('FIX50',50000,'fixed','2025-01-01','2026-06-30'),
('FIX100',100000,'fixed','2025-01-01','2026-06-30'),
('VIP5',5,'percent','2025-02-01','2026-12-31'),
('VIP15',15,'percent','2025-02-01','2025-12-31'),
('NEW50',50000,'fixed','2025-03-01','2025-09-01'),
('SUMMER10',10,'percent','2025-06-01','2025-08-31'),
('HOT20',20,'percent','2025-07-01','2025-09-30'),
('BLACK100',100000,'fixed','2025-11-01','2025-11-30');

INSERT INTO Categories (name) VALUES
('Hành động'),('Tình cảm'),('Kinh dị'),('Hài'),
('Hoạt hình'),('Phiêu lưu'),('Tâm lý'),
('Khoa học viễn tưởng'),('Gia đình'),('Âm nhạc');

INSERT INTO Movies
(title,description,format,duration,release_date,age,language,name_character,poster,trailer) VALUES
('Fast X','Đua xe tốc độ','2D',130,'2024-05-01',16,'English','Dom, Letty','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2Fnha-ba-toi-mot-phong-teaser.jpg&w=640&q=50','v=dz5mN-iIC4g'),
('Titanic','Chuyện tình bi thương','2D',195,'2025-12-19',13,'English','Jack, Rose','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2FFINNICK-MAIN_POSTER.jpg&w=640&q=50','v=Qg_vcCwvnIs'),
('Conjuring','Phim kinh dị','2D',120,'2023-10-01',18,'English','Ed, Lorraine','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2Fnguoi-dep-quai-la-main.jpg&w=640&q=50','v=Qg_vcCwvnIs'),
('Avengers','Siêu anh hùng','3D',150,'2019-04-20',13,'English','Iron Man','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2Ftinh-dau-kho-noi-main.jpg&w=640&q=50','v=Qg_vcCwvnIs'),
('Toy Story','Hoạt hình','2D',95,'2015-06-10',0,'English','Woody','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2Fboss.png&w=640&q=50','v=Qg_vcCwvnIs'),
('Up','Phiêu lưu','2D',100,'2012-05-05',0,'English','Carl','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2Ftom-jerry.jpg&w=640&q=50','v=Qg_vcCwvnIs'),
('Joker','Tâm lý','2D',120,'2026-02-10',18,'English','Arthur','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2026%2FMB-Main_Poster-Social.jpg&w=640&q=50','v=Qg_vcCwvnIs'),
('Gia đình là số 1','Gia đình','2D',90,'2026-01-01',0,'Vietnamese','Ba, Mẹ','https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F02-2026%2Ftho-oi.jpeg&w=640&q=50','v=Qg_vcCwvnIs')

INSERT INTO MovieCategories VALUES
(1,1),(2,2),(3,3),(4,1),(5,5),
(6,6),(7,7),(8,8),(7,9),(8,10);

INSERT INTO Movietheaters (name,address,city) VALUES
('CGV Vincom','72 Lê Thánh Tôn','HCM'),
('Lotte Cinema','50 Nguyễn Trãi','HCM'),
('Galaxy','100 Trần Hưng Đạo','Hà Nội'),
('BHD','35 Hai Bà Trưng','Hà Nội'),
('Beta','25 Phạm Văn Đồng','Đà Nẵng')

INSERT INTO Rooms (theaterId,name,totalSeats) VALUES
(1,'Room 1',50),(1,'Room 2',60),
(2,'Room 1',70),(2,'Room 2',80),
(3,'Room 1',50),(3,'Room 2',40),
(4,'Room 1',60),(4,'Room 2',70),
(5,'Room 1',50),(5,'Room 2',60);

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row A
(1,'A',1,'A1','standard'),(1,'A',2,'A2','standard'),(1,'A',3,'A3','standard'),
(1,'A',4,'A4','standard'),(1,'A',5,'A5','standard'),(1,'A',6,'A6','standard'),
(1,'A',7,'A7','standard'),

-- Row B
(1,'B',1,'B1','standard'),(1,'B',2,'B2','standard'),(1,'B',3,'B3','standard'),
(1,'B',4,'B4','standard'),(1,'B',5,'B5','standard'),(1,'B',6,'B6','standard'),
(1,'B',7,'B7','standard'),

-- Row C
(1,'C',1,'C1','standard'),(1,'C',2,'C2','standard'),(1,'C',3,'C3','standard'),
(1,'C',4,'C4','standard'),(1,'C',5,'C5','standard'),(1,'C',6,'C6','standard'),
(1,'C',7,'C7','standard'),

-- Row D
(1,'D',1,'D1','standard'),(1,'D',2,'D2','standard'),(1,'D',3,'D3','standard'),
(1,'D',4,'D4','standard'),(1,'D',5,'D5','standard'),(1,'D',6,'D6','standard'),
(1,'D',7,'D7','standard'),

-- Row E
(1,'E',1,'E1','standard'),(1,'E',2,'E2','standard'),(1,'E',3,'E3','standard'),
(1,'E',4,'E4','standard'),(1,'E',5,'E5','standard'),(1,'E',6,'E6','standard'),
(1,'E',7,'E7','standard');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row F
(1,'F',1,'F1','vip'),(1,'F',2,'F2','vip'),(1,'F',3,'F3','vip'),
(1,'F',4,'F4','vip'),(1,'F',5,'F5','vip'),(1,'F',6,'F6','vip'),
(1,'F',7,'F7','vip'),

-- Row G
(1,'G',1,'G1','vip'),(1,'G',2,'G2','vip'),(1,'G',3,'G3','vip'),
(1,'G',4,'G4','vip'),(1,'G',5,'G5','vip'),(1,'G',6,'G6','vip'),
(1,'G',7,'G7','vip');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
(1,'H',1,'01-02','couple'),
(1,'H',3,'03-04','couple'),
(1,'H',5,'05-06','couple');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row A
(2,'A',1,'A1','standard'),(2,'A',2,'A2','standard'),(2,'A',3,'A3','standard'),
(2,'A',4,'A4','standard'),(2,'A',5,'A5','standard'),(2,'A',6,'A6','standard'),
(2,'A',7,'A7','standard'),

-- Row B
(2,'B',1,'B1','standard'),(2,'B',2,'B2','standard'),(2,'B',3,'B3','standard'),
(2,'B',4,'B4','standard'),(2,'B',5,'B5','standard'),(2,'B',6,'B6','standard'),
(2,'B',7,'B7','standard'),

-- Row C
(2,'C',1,'C1','standard'),(2,'C',2,'C2','standard'),(2,'C',3,'C3','standard'),
(2,'C',4,'C4','standard'),(2,'C',5,'C5','standard'),(2,'C',6,'C6','standard'),
(2,'C',7,'C7','standard'),

-- Row D
(2,'D',1,'D1','standard'),(2,'D',2,'D2','standard'),(2,'D',3,'D3','standard'),
(2,'D',4,'D4','standard'),(2,'D',5,'D5','standard'),(2,'D',6,'D6','standard'),
(2,'D',7,'D7','standard'),

-- Row E
(2,'E',1,'E1','standard'),(2,'E',2,'E2','standard'),(2,'E',3,'E3','standard'),
(2,'E',4,'E4','standard'),(2,'E',5,'E5','standard'),(2,'E',6,'E6','standard'),
(2,'E',7,'E7','standard');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row F
(2,'F',1,'F1','vip'),(2,'F',2,'F2','vip'),(2,'F',3,'F3','vip'),
(2,'F',4,'F4','vip'),(2,'F',5,'F5','vip'),(2,'F',6,'F6','vip'),
(2,'F',7,'F7','vip'),

-- Row G
(2,'G',1,'G1','vip'),(2,'G',2,'G2','vip'),(2,'G',3,'G3','vip'),
(2,'G',4,'G4','vip'),(2,'G',5,'G5','vip'),(2,'G',6,'G6','vip'),
(2,'G',7,'G7','vip');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
(2,'H',1,'01-02','couple'),
(2,'H',3,'03-04','couple'),
(2,'H',5,'05-06','couple');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row A
(3,'A',1,'A1','standard'),(3,'A',2,'A2','standard'),(3,'A',3,'A3','standard'),
(3,'A',4,'A4','standard'),(3,'A',5,'A5','standard'),(3,'A',6,'A6','standard'),
(3,'A',7,'A7','standard'),

-- Row B
(3,'B',1,'B1','standard'),(3,'B',2,'B2','standard'),(3,'B',3,'B3','standard'),
(3,'B',4,'B4','standard'),(3,'B',5,'B5','standard'),(3,'B',6,'B6','standard'),
(3,'B',7,'B7','standard'),

-- Row C
(3,'C',1,'C1','standard'),(3,'C',2,'C2','standard'),(3,'C',3,'C3','standard'),
(3,'C',4,'C4','standard'),(3,'C',5,'C5','standard'),(3,'C',6,'C6','standard'),
(3,'C',7,'C7','standard'),

-- Row D
(3,'D',1,'D1','standard'),(3,'D',2,'D2','standard'),(3,'D',3,'D3','standard'),
(3,'D',4,'D4','standard'),(3,'D',5,'D5','standard'),(3,'D',6,'D6','standard'),
(3,'D',7,'D7','standard'),

-- Row E
(3,'E',1,'E1','standard'),(3,'E',2,'E2','standard'),(3,'E',3,'E3','standard'),
(3,'E',4,'E4','standard'),(3,'E',5,'E5','standard'),(3,'E',6,'E6','standard'),
(3,'E',7,'E7','standard');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row F
(3,'F',1,'F1','vip'),(3,'F',2,'F2','vip'),(3,'F',3,'F3','vip'),
(3,'F',4,'F4','vip'),(3,'F',5,'F5','vip'),(3,'F',6,'F6','vip'),
(3,'F',7,'F7','vip'),

-- Row G
(3,'G',1,'G1','vip'),(3,'G',2,'G2','vip'),(3,'G',3,'G3','vip'),
(3,'G',4,'G4','vip'),(3,'G',5,'G5','vip'),(3,'G',6,'G6','vip'),
(3,'G',7,'G7','vip');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
(3,'H',1,'01-02','couple'),
(3,'H',3,'03-04','couple'),
(3,'H',5,'05-06','couple');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row A
(4,'A',1,'A1','standard'),(4,'A',2,'A2','standard'),(4,'A',3,'A3','standard'),
(4,'A',4,'A4','standard'),(4,'A',5,'A5','standard'),(4,'A',6,'A6','standard'),
(4,'A',7,'A7','standard'),

-- Row B
(4,'B',1,'B1','standard'),(4,'B',2,'B2','standard'),(4,'B',3,'B3','standard'),
(4,'B',4,'B4','standard'),(4,'B',5,'B5','standard'),(4,'B',6,'B6','standard'),
(4,'B',7,'B7','standard'),

-- Row C
(4,'C',1,'C1','standard'),(4,'C',2,'C2','standard'),(4,'C',3,'C3','standard'),
(4,'C',4,'C4','standard'),(4,'C',5,'C5','standard'),(4,'C',6,'C6','standard'),
(4,'C',7,'C7','standard'),

-- Row D
(4,'D',1,'D1','standard'),(4,'D',2,'D2','standard'),(4,'D',3,'D3','standard'),
(4,'D',4,'D4','standard'),(4,'D',5,'D5','standard'),(4,'D',6,'D6','standard'),
(4,'D',7,'D7','standard'),

-- Row E
(4,'E',1,'E1','standard'),(4,'E',2,'E2','standard'),(4,'E',3,'E3','standard'),
(4,'E',4,'E4','standard'),(4,'E',5,'E5','standard'),(4,'E',6,'E6','standard'),
(4,'E',7,'E7','standard');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row F
(4,'F',1,'F1','vip'),(4,'F',2,'F2','vip'),(4,'F',3,'F3','vip'),
(4,'F',4,'F4','vip'),(4,'F',5,'F5','vip'),(4,'F',6,'F6','vip'),
(4,'F',7,'F7','vip'),

-- Row G
(4,'G',1,'G1','vip'),(4,'G',2,'G2','vip'),(4,'G',3,'G3','vip'),
(4,'G',4,'G4','vip'),(4,'G',5,'G5','vip'),(4,'G',6,'G6','vip'),
(4,'G',7,'G7','vip');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
(4,'H',1,'01-02','couple'),
(4,'H',3,'03-04','couple'),
(4,'H',5,'05-06','couple');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row A
(5,'A',1,'A1','standard'),(5,'A',2,'A2','standard'),(5,'A',3,'A3','standard'),
(5,'A',4,'A4','standard'),(5,'A',5,'A5','standard'),(5,'A',6,'A6','standard'),
(5,'A',7,'A7','standard'),

-- Row B
(5,'B',1,'B1','standard'),(5,'B',2,'B2','standard'),(5,'B',3,'B3','standard'),
(5,'B',4,'B4','standard'),(5,'B',5,'B5','standard'),(5,'B',6,'B6','standard'),
(5,'B',7,'B7','standard'),

-- Row C
(5,'C',1,'C1','standard'),(5,'C',2,'C2','standard'),(5,'C',3,'C3','standard'),
(5,'C',4,'C4','standard'),(5,'C',5,'C5','standard'),(5,'C',6,'C6','standard'),
(5,'C',7,'C7','standard'),

-- Row D
(5,'D',1,'D1','standard'),(5,'D',2,'D2','standard'),(5,'D',3,'D3','standard'),
(5,'D',4,'D4','standard'),(5,'D',5,'D5','standard'),(5,'D',6,'D6','standard'),
(5,'D',7,'D7','standard'),

-- Row E
(5,'E',1,'E1','standard'),(5,'E',2,'E2','standard'),(5,'E',3,'E3','standard'),
(5,'E',4,'E4','standard'),(5,'E',5,'E5','standard'),(5,'E',6,'E6','standard'),
(5,'E',7,'E7','standard');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
-- Row F
(5,'F',1,'F1','vip'),(5,'F',2,'F2','vip'),(5,'F',3,'F3','vip'),
(5,'F',4,'F4','vip'),(5,'F',5,'F5','vip'),(5,'F',6,'F6','vip'),
(5,'F',7,'F7','vip'),

-- Row G
(5,'G',1,'G1','vip'),(5,'G',2,'G2','vip'),(5,'G',3,'G3','vip'),
(5,'G',4,'G4','vip'),(5,'G',5,'G5','vip'),(5,'G',6,'G6','vip'),
(5,'G',7,'G7','vip');

INSERT INTO Seats (roomId, rowLabel, seatIndex, seatNumber, type) VALUES
(5,'H',1,'01-02','couple'),
(5,'H',3,'03-04','couple'),
(5,'H',5,'05-06','couple');

INSERT INTO Showtimes (movieId,roomId,startTime,price) VALUES
(1,1,'2026-02-24 16:00:00',90000),
(2,2,'2026-02-24 15:00:00',80000),
(3,3,'2026-02-21 18:00:00',85000),
(4,4,'2026-03-21 20:00:00',95000),
(5,5,'2026-03-22 17:00:00',70000),
(6,6,'2026-03-22 19:00:00',75000),
