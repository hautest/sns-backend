import supabase from '../../supabase/supabase';
import PostController from '../post/post.controller';

interface MyInfoParams {
  accessToken: string;
}

interface MyPostsParams extends MyInfoParams {
  cursor: number;
  limit: number;
}

const postController = new PostController();

export default class MyController {
  async getMyInfo({ accessToken }: MyInfoParams) {
    const authResult = await supabase.auth.getUser(accessToken);

    if (authResult.error) {
      return authResult;
    }

    const userResult = await supabase
      .from('users')
      .select('*')
      .eq('id', authResult.data?.user?.id ?? '')
      .single();
    const { id, email } = authResult.data.user;

    return {
      error: userResult.error,
      data: { nickname: userResult.data?.nickname, id, email },
    };
  }

  async getMyPosts({ accessToken, cursor, limit }: MyPostsParams) {
    const authResult = await supabase.auth.getUser(accessToken);

    if (authResult.error) {
      return authResult;
    }

    const postResult = await postController.findAll({
      cursor,
      limit,
      accessToken,
    });

    return postResult;
  }
}
