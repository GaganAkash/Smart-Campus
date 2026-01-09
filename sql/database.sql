-- Smart Campus Companion Database Schema
-- This file contains the SQL commands to create the database and tables for the application.

-- Create the database
CREATE DATABASE IF NOT EXISTS smart_campus;
USE smart_campus;

-- Students table for user authentication
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable table
CREATE TABLE timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Announcements table (simulated admin/faculty posts)
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost and Found table
CREATE TABLE lost_found (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('lost', 'found') NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_details VARCHAR(255) NOT NULL,
    student_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- Doubt Forum table (anonymous)
CREATE TABLE forum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
-- Sample student
INSERT INTO students (name, usn, email, password) VALUES
('John Doe', '1ABC123', 'john@example.com', '$2y$10$examplehashedpassword');

-- Sample timetable entries
INSERT INTO timetable (student_id, subject, faculty, day, start_time, end_time, room) VALUES
(1, 'Mathematics', 'Dr. Smith', 'Monday', '09:00:00', '10:30:00', 'Room 101'),
(1, 'Physics', 'Prof. Johnson', 'Tuesday', '11:00:00', '12:30:00', 'Room 102');

-- Sample assignments
INSERT INTO assignments (student_id, subject, description, due_date) VALUES
(1, 'Mathematics', 'Complete chapter 5 exercises', '2023-12-15'),
(1, 'Physics', 'Lab report submission', '2023-12-20');

-- Sample announcements
INSERT INTO announcements (title, message) VALUES
('Exam Schedule', 'Mid-term exams will start from December 10th.'),
('Holiday Notice', 'College will be closed on December 25th for Christmas.');

-- Sample lost and found
INSERT INTO lost_found (type, item_name, description, contact_details, student_id) VALUES
('lost', 'Water Bottle', 'Blue insulated water bottle lost in cafeteria.', 'john@example.com', 1),
('found', 'Notebook', 'Found a mathematics notebook in library.', 'Contact admin', NULL);

-- Sample forum questions
INSERT INTO forum (question) VALUES
('How to solve quadratic equations?'),
('What is the syllabus for next semester?');
