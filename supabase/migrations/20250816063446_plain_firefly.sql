/*
  # Add missing columns and defaults for chat application

  1. Table Updates
    - Add missing 'title' and 'updated_at' columns to 'chats' table
    - Add missing 'is_from_bot' column to 'messages' table
    - Set proper default values for all columns

  2. Column Defaults
    - chats.title: 'Chat with Bot'
    - chats.updated_at: now()
    - messages.is_from_bot: false
    - messages.sender_type: 'user'

  3. Triggers
    - Add trigger to automatically update 'updated_at' timestamp
*/

-- Add missing columns to chats table if they don't exist
DO $$
BEGIN
  -- Add title column with default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chats' AND column_name = 'title'
  ) THEN
    ALTER TABLE chats ADD COLUMN title text DEFAULT 'Chat with Bot';
  ELSE
    -- Set default if column exists but doesn't have one
    ALTER TABLE chats ALTER COLUMN title SET DEFAULT 'Chat with Bot';
  END IF;

  -- Add updated_at column with default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chats' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE chats ADD COLUMN updated_at timestamptz DEFAULT now();
  ELSE
    -- Set default if column exists but doesn't have one
    ALTER TABLE chats ALTER COLUMN updated_at SET DEFAULT now();
  END IF;
END $$;

-- Add missing columns to messages table if they don't exist
DO $$
BEGIN
  -- Add is_from_bot column with default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'is_from_bot'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_from_bot boolean DEFAULT false;
  ELSE
    -- Set default if column exists but doesn't have one
    ALTER TABLE messages ALTER COLUMN is_from_bot SET DEFAULT false;
  END IF;

  -- Set default for sender_type if it doesn't have one
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'sender_type'
  ) THEN
    ALTER TABLE messages ALTER COLUMN sender_type SET DEFAULT 'user';
  END IF;
END $$;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on chats table
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update any existing chats that don't have updated_at set
UPDATE chats SET updated_at = created_at WHERE updated_at IS NULL;

-- Update any existing messages that don't have is_from_bot set
UPDATE messages SET is_from_bot = false WHERE is_from_bot IS NULL;

-- Update any existing messages that don't have sender_type set
UPDATE messages SET sender_type = 'user' WHERE sender_type IS NULL;