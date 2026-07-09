-- Drop tables if they exist
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS follow_up;
DROP TABLE IF EXISTS customer_lead;
DROP TABLE IF EXISTS lead_type;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lead Type Table
CREATE TABLE lead_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Lead Table
CREATE TABLE customer_lead (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    alternate_number VARCHAR(15),
    email VARCHAR(100),
    lead_type_id BIGINT,
    city VARCHAR(50),
    address TEXT,
    requirement TEXT,
    lead_source VARCHAR(50),
    assigned_executive VARCHAR(100),
    discussion_details TEXT,
    visit_date DATE,
    next_followup_date DATE,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_type_id) REFERENCES lead_type(id)
);

-- Follow Up Table
CREATE TABLE follow_up (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    discussion TEXT NOT NULL,
    followup_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES customer_lead(id) ON DELETE CASCADE
);

-- Notes Table
CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES customer_lead(id) ON DELETE CASCADE
);
