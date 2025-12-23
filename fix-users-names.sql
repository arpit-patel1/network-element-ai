-- Fix script for user names in public.users table

-- Step 1: Drop and recreate the trigger function to ensure it's correct
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate the function with correct logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.email
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Update existing users in public.users to get correct names from auth.users
UPDATE public.users u
SET 
  name = COALESCE(
    a.raw_user_meta_data->>'name',
    a.email
  ),
  updated_at = now()
FROM auth.users a
WHERE u.id = a.id;

-- Step 5: Verify the update
SELECT 
  u.id,
  u.name as public_users_name,
  a.email,
  a.raw_user_meta_data->>'name' as metadata_name,
  a.raw_user_meta_data
FROM public.users u
JOIN auth.users a ON u.id = a.id;

