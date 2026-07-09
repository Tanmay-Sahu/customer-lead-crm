-- Insert Default Admin
INSERT INTO users (username, password, name, role) VALUES ('admin', 'admin123', 'System Administrator', 'ADMIN');

-- Insert Sample Lead Types
INSERT INTO lead_type (lead_type_name, description) VALUES ('School Admission', 'Leads interested in school admissions');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Apartment', 'Leads looking for residential apartments');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Property', 'Leads interested in real estate properties');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Laptop', 'Leads interested in buying laptops');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Insurance', 'Leads looking for life or health insurance');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Hospital', 'Leads related to hospital services');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Car', 'Leads interested in buying new or used cars');
INSERT INTO lead_type (lead_type_name, description) VALUES ('Others', 'General leads');

-- Insert 20 Sample Customer Leads
INSERT INTO customer_lead (customer_name, mobile, email, lead_type_id, city, requirement, lead_source, status, priority) VALUES 
('Rahul Sharma', '9876543210', 'rahul@example.com', 2, 'Mumbai', '2BHK Apartment', 'Website', 'NEW', 'HOT'),
('Priya Patel', '9876543211', 'priya@example.com', 1, 'Ahmedabad', 'Class 5 Admission', 'Reference', 'CONTACTED', 'WARM'),
('Amit Gupta', '9876543212', 'amit@example.com', 3, 'Delhi', 'Commercial Shop', 'Google Ads', 'INTERESTED', 'HOT'),
('Sneha Reddy', '9876543213', 'sneha@example.com', 4, 'Hyderabad', 'Gaming Laptop', 'Facebook', 'FOLLOW_UP', 'COLD'),
('Vikram Singh', '9876543214', 'vikram@example.com', 5, 'Jaipur', 'Health Insurance', 'Direct', 'VISIT_SCHEDULED', 'WARM'),
('Anjali Desai', '9876543215', 'anjali@example.com', 1, 'Pune', 'Class 1 Admission', 'Newspaper', 'NEGOTIATION', 'HOT'),
('Rohan Mehra', '9876543216', 'rohan@example.com', 7, 'Chandigarh', 'SUV Car', 'Website', 'CLOSED_WON', 'HOT'),
('Kavita Rao', '9876543217', 'kavita@example.com', 2, 'Bangalore', '3BHK Villa', 'Reference', 'CLOSED_LOST', 'WARM'),
('Suresh Kumar', '9876543218', 'suresh@example.com', 8, 'Lucknow', 'General Query', 'Google Ads', 'NOT_INTERESTED', 'COLD'),
('Deepak Verma', '9876543219', 'deepak@example.com', 4, 'Indore', 'Workstation Laptop', 'Facebook', 'NEW', 'WARM'),
('Manisha Iyer', '9876543220', 'manisha@example.com', 1, 'Chennai', 'Pre-school', 'Website', 'CONTACTED', 'HOT'),
('Arjun Kapoor', '9876543221', 'arjun@example.com', 3, 'Kolkata', 'Land Property', 'Reference', 'INTERESTED', 'COLD'),
('Sapna Jain', '9876543222', 'sapna@example.com', 5, 'Bhopal', 'Term Insurance', 'Direct', 'FOLLOW_UP', 'WARM'),
('Rajesh Khanna', '9876543223', 'rajesh@example.com', 7, 'Surat', 'Sedan Car', 'Google Ads', 'VISIT_SCHEDULED', 'HOT'),
('Pooja Hegde', '9876543224', 'pooja@example.com', 6, 'Nagpur', 'Surgery Package', 'Facebook', 'NEGOTIATION', 'WARM'),
('Karan Malhotra', '9876543225', 'karan@example.com', 2, 'Gurgaon', '1BHK Studio', 'Website', 'CLOSED_WON', 'HOT'),
('Divya Dutta', '9876543226', 'divya@example.com', 1, 'Noida', 'Class 10 Admission', 'Reference', 'CLOSED_LOST', 'COLD'),
('Sandeep Bakshi', '9876543227', 'sandeep@example.com', 7, 'Patna', 'Hatchback Car', 'Direct', 'NOT_INTERESTED', 'WARM'),
('Neha Kakkar', '9876543228', 'neha@example.com', 4, 'Ludhiana', 'MacBook Air', 'Newspaper', 'NEW', 'HOT'),
('Varun Dhawan', '9876543229', 'varun@example.com', 3, 'Vijayawada', 'Industrial Plot', 'Google Ads', 'CONTACTED', 'COLD');
