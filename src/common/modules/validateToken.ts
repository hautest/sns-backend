import supabase from '../../supabase/supabase';

/**
 * @param token access_token
 */
export const validateToken = async (token: string) => {
  const { error } = await supabase.auth.getUser(token);

  return !error;
};
