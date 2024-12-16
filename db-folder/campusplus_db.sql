-- Use the existing database
-- create database if not exists itloesninger_dk_db_campusplus;
USE itloesninger_dk_db_campusplus;

-- 1. Opret Schools
CREATE TABLE IF NOT EXISTS Schools (
    SchoolID INT PRIMARY KEY AUTO_INCREMENT,
    SchoolName VARCHAR(255) NOT NULL UNIQUE,
    Location VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Opret Users
CREATE TABLE IF NOT EXISTS Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Student', 'Teacher', 'Leader') NOT NULL,
    PhoneNumber VARCHAR(15),
    SchoolID INT,
    FOREIGN KEY (SchoolID) REFERENCES Schools(SchoolID)
);

-- 3. Opret Classes
CREATE TABLE IF NOT EXISTS Classes (
    ClassID INT PRIMARY KEY AUTO_INCREMENT,
    ClassName VARCHAR(255) NOT NULL,
    SchoolID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    InvitationCode VARCHAR(10) UNIQUE NOT NULL,
    FOREIGN KEY (SchoolID) REFERENCES Schools(SchoolID)
);

-- 4. Opret StudentClasses (relation mellem studerende og klasser)
CREATE TABLE IF NOT EXISTS StudentClasses (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT NOT NULL,
    ClassID INT NOT NULL,
    JoinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Users(UserID),
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);

-- 5. Opret BulkOrders
CREATE TABLE IF NOT EXISTS BulkOrders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    ClassID INT NOT NULL,
    TeacherID INT NOT NULL,
    TotalTickets INT NOT NULL,
    IncludesLunch BOOLEAN DEFAULT FALSE,
    IncludesCoffee BOOLEAN DEFAULT FALSE,
    InvitationCode VARCHAR(10) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
    FOREIGN KEY (TeacherID) REFERENCES Users(UserID),
    FOREIGN KEY (InvitationCode) REFERENCES Classes(InvitationCode)
);

-- 6. Opret Tickets
CREATE TABLE IF NOT EXISTS Tickets (
    TicketID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ClaimedBy INT,
    IncludesLunch BOOLEAN DEFAULT FALSE,
    IncludesCoffee BOOLEAN DEFAULT FALSE,
    IsClaimed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (OrderID) REFERENCES BulkOrders(OrderID),
    FOREIGN KEY (ClaimedBy) REFERENCES Users(UserID)
);

-- 7. Opret Resources (til undervisningsmateriale og kort)
CREATE TABLE IF NOT EXISTS Resources (
    ResourceID INT PRIMARY KEY AUTO_INCREMENT,
    ClassID INT,
    Title VARCHAR(255),
    URL VARCHAR(2083),
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);

-- 8. Opret Evaluations (til feedback)
CREATE TABLE IF NOT EXISTS Evaluations (
    EvaluationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ClassID INT,
    FeedbackText TEXT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    SubmittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);

-- Insert eksempeldata
-- Schools
INSERT INTO Schools (SchoolName, Location) VALUES
('Zealand Business School', 'Køge')
ON DUPLICATE KEY UPDATE Location = 'Køge';

-- Users
INSERT INTO Users (Name, Email, Password, Role, PhoneNumber, SchoolID) VALUES
('Alice', 'alice@example.com', 'hashed_password', 'Teacher', '12345678', 1),
('Bob', 'bob@example.com', 'hashed_password', 'Student', '87654321', 1),
('Carol', 'carol@example.com', 'hashed_password', 'Student', '11223344', 1)
ON DUPLICATE KEY UPDATE Password = VALUES(Password), Role = VALUES(Role);

-- Classes
INSERT INTO Classes (ClassName, SchoolID, StartDate, EndDate, InvitationCode) VALUES
('Mathematics 1A', 1, '2024-01-01', '2024-06-30', 'MAT2024')
ON DUPLICATE KEY UPDATE StartDate = VALUES(StartDate), EndDate = VALUES(EndDate);

-- BulkOrders
INSERT INTO BulkOrders (ClassID, TeacherID, TotalTickets, IncludesLunch, IncludesCoffee, InvitationCode) VALUES
(1, 1, 20, TRUE, FALSE, 'MAT2024')
ON DUPLICATE KEY UPDATE TotalTickets = VALUES(TotalTickets);

-- Tickets
INSERT INTO Tickets (OrderID) VALUES
(1), (1), (1), (1), (1), (1), (1), (1), (1), (1);

-- StudentClasses
INSERT INTO StudentClasses (StudentID, ClassID) VALUES
(2, 1), (3, 1);

-- Resources
INSERT INTO Resources (ClassID, Title, URL) VALUES
(1, 'Undervisningsmateriale - Matematik', 'https://example.com/matematik.pdf'),
(1, 'Interaktivt kort', 'https://example.com/map.pdf');

-- Evaluations
INSERT INTO Evaluations (UserID, ClassID, FeedbackText, Rating) VALUES
(2, 1, 'Det var en fantastisk oplevelse!', 5),
(3, 1, 'Godt organiseret, men maden kunne være bedre.', 4);
