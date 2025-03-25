/*
  # Fix decrement function to handle single access code

  1. Changes
    - Update decrement function to accept access code parameter
    - Add WHERE clause to target specific access code
    - Return remaining accesses for that specific code

  2. Security
    - Maintain security definer
    - Add input validation
*/

CREATE OR REPLACE FUNCTION decrement(code_param text)
RETURNS integer
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  new_remaining integer;
BEGIN
  IF code_param IS NULL THEN
    RAISE EXCEPTION 'Access code parameter cannot be null';
  END IF;

  UPDATE access_codes
  SET remaining_accesses = remaining_accesses - 1
  WHERE code = code_param
    AND remaining_accesses > 0
    AND is_active = true
  RETURNING remaining_accesses INTO new_remaining;
  
  IF new_remaining IS NULL THEN
    RAISE EXCEPTION 'Invalid or inactive access code';
  END IF;
  
  RETURN new_remaining;
END;
$$;