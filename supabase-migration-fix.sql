-- Fix for missing join_date column in user_profiles table
-- Run this in your Supabase SQL Editor

-- Add join_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='user_profiles' 
        AND column_name='join_date'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN join_date TIMESTAMPTZ DEFAULT NOW();
        
        -- Update existing rows using updated_at (not created_at)
        UPDATE user_profiles 
        SET join_date = updated_at 
        WHERE join_date IS NULL AND updated_at IS NOT NULL;
        
        -- Fallback to current timestamp
        UPDATE user_profiles 
        SET join_date = NOW() 
        WHERE join_date IS NULL;
    END IF;
END $$;

-- Add plan column if it doesn't exist
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

-- Add subscription_status column if it doesn't exist
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
AND column_name IN ('join_date', 'plan', 'subscription_status', 'updated_at');
