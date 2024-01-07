import supabase from '../../../supabase/supabase';

export default class AccessTokenController {
  async generateAccessToken(refreshToken: string) {
    const result = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    return result;
  }
}
