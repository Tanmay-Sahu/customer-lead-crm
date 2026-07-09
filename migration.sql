-- Data Migration to fix Enum Case Sensitivity
-- Run this on your existing database to fix mismatches

USE crm_db;

-- 1. Fix Priority
UPDATE customer_lead SET priority = 'HOT' WHERE LOWER(priority) = 'hot';
UPDATE customer_lead SET priority = 'WARM' WHERE LOWER(priority) = 'warm';
UPDATE customer_lead SET priority = 'COLD' WHERE LOWER(priority) = 'cold';
UPDATE customer_lead SET priority = 'NOT_CUSTOMER' WHERE LOWER(priority) IN ('not a customer', 'not_customer');

-- 2. Fix Lead Status
UPDATE customer_lead SET status = 'NEW' WHERE LOWER(status) = 'new';
UPDATE customer_lead SET status = 'CONTACTED' WHERE LOWER(status) = 'contacted';
UPDATE customer_lead SET status = 'INTERESTED' WHERE LOWER(status) = 'interested';
UPDATE customer_lead SET status = 'FOLLOW_UP' WHERE LOWER(status) IN ('follow up', 'follow_up');
UPDATE customer_lead SET status = 'VISIT_SCHEDULED' WHERE LOWER(status) IN ('visit scheduled', 'visit_scheduled');
UPDATE customer_lead SET status = 'NEGOTIATION' WHERE LOWER(status) = 'negotiation';
UPDATE customer_lead SET status = 'CLOSED_WON' WHERE LOWER(status) IN ('closed won', 'closed_won');
UPDATE customer_lead SET status = 'CLOSED_LOST' WHERE LOWER(status) IN ('closed lost', 'closed_lost');
UPDATE customer_lead SET status = 'NOT_INTERESTED' WHERE LOWER(status) IN ('not interested', 'not_interested');

-- 3. Fix Follow-up Status
UPDATE follow_ups SET status = 'PENDING' WHERE LOWER(status) = 'pending';
UPDATE follow_ups SET status = 'COMPLETED' WHERE LOWER(status) = 'completed';
UPDATE follow_ups SET status = 'CANCELLED' WHERE LOWER(status) = 'cancelled';

-- 4. Fix User Roles
UPDATE users SET role = 'ADMIN' WHERE LOWER(role) = 'admin';
UPDATE users SET role = 'EXECUTIVE' WHERE LOWER(role) = 'executive';
