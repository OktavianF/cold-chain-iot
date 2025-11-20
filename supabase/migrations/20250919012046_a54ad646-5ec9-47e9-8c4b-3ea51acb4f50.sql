-- Create a default user for testing
INSERT INTO public.users_new (username, password, name) 
VALUES ('operator', 'password', 'System Operator')
ON CONFLICT (username) DO NOTHING;