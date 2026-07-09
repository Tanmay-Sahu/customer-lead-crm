-- MySQL Script for Customer Lead CRM
CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: lead_type
CREATE TABLE IF NOT EXISTS lead_types (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_type_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: customer_leads
CREATE TABLE IF NOT EXISTS customer_leads (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  alternate_number VARCHAR(15),
  email VARCHAR(100),
  lead_type_id BIGINT,
  city VARCHAR(100),
  address TEXT,
  requirement TEXT,
  lead_source VARCHAR(100),
  assigned_executive VARCHAR(100),
  discussion_details TEXT,
  visit_date DATE,
  next_followup_date DATE,
  status VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_type_id) REFERENCES lead_types(id)
);

-- Table: follow_ups
CREATE TABLE IF NOT EXISTS follow_ups (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT NOT NULL,
  discussion TEXT NOT NULL,
  follow_up_date DATETIME NOT NULL,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES customer_leads(id) ON DELETE CASCADE
);

-- Table: notes
CREATE TABLE IF NOT EXISTS notes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT NOT NULL,
  note_content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES customer_leads(id) ON DELETE CASCADE
);

-- Seed Data
INSERT INTO users (username, password, name, role) VALUES ('admin', 'admin123', 'Project Admin', 'ADMIN');
INSERT INTO lead_types (lead_type_name, description) VALUES ('Website Inquiry', 'Leads from official website');
