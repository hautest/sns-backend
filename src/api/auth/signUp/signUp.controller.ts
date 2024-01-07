import supabase from '../../../supabase/supabase';

interface SignUpParams {
  email: string;
  password: string;
  nickname: string;
}

export default class SignUpController {
  async signUp({ email, password, nickname }: SignUpParams) {
    const { error: authError, data: authData } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { errorMessage: authError?.message };
    }
    const id = authData?.user?.id as string;

    const { error: userError } = await supabase
      .from('users')
      .insert({ nickname, id });

    if (userError) {
      return { errorMessage: userError?.message };
    }

    const { access_token, refresh_token } = authData.session || {};

    const userData = {
      email,
      nickname,
      access_token,
      refresh_token,
    };

    return { data: userData };
  }
}
