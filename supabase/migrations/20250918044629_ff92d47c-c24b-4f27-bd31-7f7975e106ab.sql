-- Drop the existing constraint if it exists
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Update the profiles table to only allow operator role
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'operator';

-- Update existing users to have operator role
UPDATE public.profiles 
SET role = 'operator' 
WHERE role = 'user';

-- Create a constraint to only allow operator role
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = 'operator');

-- Update the handle_new_user function to set operator role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', 'operator');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;