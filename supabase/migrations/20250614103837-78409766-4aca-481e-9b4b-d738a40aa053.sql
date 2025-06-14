
-- First, we need to create helper functions that will be used in the policies.
-- These functions check for collaborator status without causing recursion.
-- Using SECURITY DEFINER allows these functions to bypass RLS for their specific internal queries.
CREATE OR REPLACE FUNCTION public.is_trip_collaborator(p_trip_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.trip_collaborators
    WHERE trip_id = p_trip_id AND user_id = p_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_trip_editor_collaborator(p_trip_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.trip_collaborators
    WHERE trip_id = p_trip_id AND user_id = p_user_id AND permission = 'edit'
  );
END;
$$;

-- Now, drop the old policies on 'trips' that were causing recursion
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;

-- Recreate the policies using the helper functions to break the recursion
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (
    auth.uid() = user_id OR
    is_public = TRUE OR
    public.is_trip_collaborator(id, auth.uid()) -- Use helper function
  );

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (
    auth.uid() = user_id OR
    public.is_trip_editor_collaborator(id, auth.uid()) -- Use helper function
  ) WITH CHECK ( -- Ensure the row still meets criteria after update
    auth.uid() = user_id OR
    public.is_trip_editor_collaborator(id, auth.uid())
  );
