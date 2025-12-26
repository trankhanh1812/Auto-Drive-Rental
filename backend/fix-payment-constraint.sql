-- Fix Payment table to allow multiple payments per booking
-- Remove unique constraint from booking_id while keeping foreign key

-- Step 1: Find the foreign key constraint name
-- SELECT CONSTRAINT_NAME 
-- FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
-- WHERE TABLE_NAME = 'payments' AND COLUMN_NAME = 'booking_id';

-- Step 2: Drop the foreign key constraint
ALTER TABLE payments DROP FOREIGN KEY UKnuscjm6x127hkb15kcb8n56wo;

-- Step 3: Drop the unique index
ALTER TABLE payments DROP INDEX UKnuscjm6x127hkb15kcb8n56wo;

-- Step 4: Re-create foreign key WITHOUT unique constraint
ALTER TABLE payments 
ADD CONSTRAINT fk_payments_booking 
FOREIGN KEY (booking_id) REFERENCES bookings(id);

-- Verify the change
SHOW CREATE TABLE payments;
