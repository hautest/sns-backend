import { WithAccessToken } from '../../common/interface/request';
import supabase from '../../supabase/supabase';

interface CreateParams extends WithAccessToken {
  comment: string;
  post_id: number;
  accessToken: string;
}

interface DeleteParams {
  id: string;
  accessToken: string;
}

export default class CommentController {
  protected async getUser(accessToken: string) {
    const result = await supabase.auth.getUser(accessToken);

    return result;
  }

  async create({ comment, post_id, accessToken }: CreateParams) {
    const userResult = await this.getUser(accessToken);

    if (userResult.error) {
      return userResult;
    }

    const postResult = await supabase
      .from('comments')
      .insert({
        comment,
        post_id,
        user_id: userResult.data.user.id,
      })
      .select();

    return postResult;
  }

  async delete({ id, accessToken }: DeleteParams) {
    const userResult = await this.getUser(accessToken);

    if (userResult.error) {
      return userResult;
    }

    const result = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', userResult.data.user.id)
      .single();

    return result;
  }
}
