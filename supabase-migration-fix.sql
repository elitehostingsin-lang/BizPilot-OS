-- Fix for missing join_date column in user_profiles table
-- Run this in your Supabase SQL Editor

-- First, check if the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_profiles' 
        AND column_name='join_date'
    ) THEN
        -- Add the join_date column if it doesn't exist
        ALTER TABLE user_profiles 
        ADD COLUMN join_date TIMESTAMPTZ DEFAULT NOW();
        
        -- Update existing rows to have a join_date
        UPDATE user_profiles 
        SET join_date = created_at 
        WHERE join_date IS NULL AND created_at IS NOT NULL;
        
        -- If no created_at, use current timestamp
        UPDATE user_profiles 
        SET join_date = NOW() 
        WHERE join_date IS NULL;
    END IF;
END $$;

-- Ensure the plan column exists and has correct type
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_profiles' 
        AND column_name='plan'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN plan TEXT DEFAULT 'Free';
    END IF;
END $$;

-- Add subscription_status if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_profiles' 
        AND column_name='subscription_status'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN subscription_status TEXT DEFAULT 'trialing';
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('join_date', 'plan', 'subscription_status');
