import supabase from '../../../supabase/supabase';

interface WithdrawParams {
  userId: string;
}

export default class WithdrawController {
  async withdraw({ userId }: WithdrawParams) {
    const result = await supabase.auth.admin.deleteUser(userId);

    return result;
  }
}
