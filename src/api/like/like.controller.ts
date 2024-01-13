import supabase from '../../supabase/supabase';

interface LikeParams {
  accessToken: string;
  post_id: number;
}

export default class LikeController {
  protected async getUser(accessToken: string) {
    const result = await supabase.auth.getUser(accessToken);

    return result;
  }

  async like({ accessToken, post_id }: LikeParams) {
    const userResult = await this.getUser(accessToken);

    if (userResult.error) {
      return userResult;
    }

    const result = await supabase
      .from('likes')
      .insert({
        post_id,
        user_id: userResult.data.user.id,
      })
      .filter('post_id', 'eq', post_id)
      .filter('user_id', 'eq', userResult.data.user.id)
      .single();

    return result;
  }

  async unlike({ accessToken, post_id }: LikeParams) {
    const userResult = await this.getUser(accessToken);

    if (userResult.error) {
      return userResult;
    }

    const result = await supabase
      .from('likes')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', userResult.data.user.id)
      .single();

    return result;
  }
}
