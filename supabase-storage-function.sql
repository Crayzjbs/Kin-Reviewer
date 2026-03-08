-- Optional: Create a function to get accurate database size
-- Run this in your Supabase SQL Editor for more accurate storage tracking
-- This is OPTIONAL - the system will work with estimates if this function doesn't exist

CREATE OR REPLACE FUNCTION get_database_size()
RETURNS NUMERIC AS $$
DECLARE
  total_size NUMERIC;
BEGIN
  SELECT 
    ROUND(
      (pg_database_size(current_database()) / 1024.0 / 1024.0)::NUMERIC, 
      2
    ) INTO total_size;
  
  RETURN total_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users (for the free tier)
GRANT EXECUTE ON FUNCTION get_database_size() TO anon;
GRANT EXECUTE ON FUNCTION get_database_size() TO authenticated;
