/*
  # Create decrement function for access codes

  1. New Functions
    - `decrement()`: Safely decrements the remaining_accesses counter
      - Returns the new remaining_accesses value
      - Ensures atomic updates
      - Prevents race conditions
*/

CREATE OR REPLACE FUNCTION decrement()
RETURNS integer
LANGUAGE sql
SECURITY definer
AS $$
  UPDATE access_codes
  SET remaining_accesses = remaining_accesses - 1
  WHERE remaining_accesses > 0
  RETURNING remaining_accesses
$$;