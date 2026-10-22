REVOKE ALL ON public.profiles, public.user_roles, public.auditoria FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.auditoria FROM authenticated;
REVOKE INSERT, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.profiles FROM authenticated;
REVOKE UPDATE, TRUNCATE, REFERENCES, TRIGGER ON public.user_roles FROM authenticated;