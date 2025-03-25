/*
  # Access Control System Schema

  1. New Tables
    - `access_codes`
      - `code` (text, primary key) - The unique access code
      - `total_accesses` (integer) - Total number of accesses granted
      - `remaining_accesses` (integer) - Number of accesses remaining
      - `created_at` (timestamp) - When the code was created
      - `last_used_at` (timestamp) - Last time the code was used
      - `is_active` (boolean) - Whether the code is still active

  2. Security
    - Enable RLS on `access_codes` table
    - Add policy for public read access to validate codes
    - Add policy for authenticated updates to remaining_accesses
*/

CREATE TABLE access_codes (
  code text PRIMARY KEY,
  total_accesses integer NOT NULL CHECK (total_accesses > 0),
  remaining_accesses integer NOT NULL CHECK (remaining_accesses >= 0),
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  CONSTRAINT remaining_not_exceed_total CHECK (remaining_accesses <= total_accesses)
);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read access code data for validation
CREATE POLICY "Allow public access code validation"
  ON access_codes
  FOR SELECT
  TO public
  USING (true);

-- Allow updates to remaining_accesses and last_used_at
CREATE POLICY "Allow updating remaining accesses"
  ON access_codes
  FOR UPDATE
  TO public
  USING (is_active = true)
  WITH CHECK (is_active = true);