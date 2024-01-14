import { WithAccessToken } from '../../common/interface/request';
import supabase from '../../supabase/supabase';

interface CreateParams extends WithAccessToken {
  title: string;
  content: string;
}

interface FindAllParams {
  cursor: number;
  limit: number;
  accessToken?: string;
}

export default class PostController {
  protected async getUser(accessToken: string) {
    const result = await supabase.auth.getUser(accessToken);

    return result;
  }

  async create({ content, title, accessToken }: CreateParams) {
    const userResult = await this.getUser(accessToken);

    if (userResult.error) {
      return userResult;
    }

    const postResult = await supabase
      .from('posts')
      .insert({
        content,
        title,
        user_id: userResult.data.user.id,
      })
      .select();

    return postResult;
  }

  async findAll({ cursor, limit, accessToken }: FindAllParams) {
    let query = supabase
      .from('posts')
      .select('*, comments(count)' as any)
      .order('created_at', { ascending: false });

    if (cursor) {
      query = query.lt('id', cursor);
    }

    if (accessToken) {
      const userResult = await this.getUser(accessToken);

      if (userResult.error) {
        return userResult;
      }

      query = query.eq('user_id', userResult.data.user.id);
    }

    const result = await query.limit(limit);

    if (!result.error && result.data) {
      result.data.forEach((post: any) => {
        if (post.comments) {
          // eslint-disable-next-line no-param-reassign
          post.comments = post.comments[0].count;
        }
      });
    }

    return result;
  }

  async findOne(id: string) {
    const result = await supabase
      .from('posts')
      .select('*, comments(*)')
      .eq('id', id)
      .single();

    return result;
  }

  async delete({ id, accessToken }: { id: string; accessToken: string }) {
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
