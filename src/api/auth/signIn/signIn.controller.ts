import supabase from '../../../supabase/supabase';

export default class SignInController {
  async signIn(email: string, password: string) {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return result;
  }
}
