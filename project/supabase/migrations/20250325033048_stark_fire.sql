CREATE OR REPLACE FUNCTION decrement()
RETURNS integer
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  new_remaining integer;
BEGIN
  UPDATE access_codes
  SET remaining_accesses = remaining_accesses - 1
  WHERE remaining_accesses > 0
  RETURNING remaining_accesses INTO new_remaining;
  
  RETURN new_remaining;
END;
$$;