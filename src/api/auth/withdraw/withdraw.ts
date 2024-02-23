import express from 'express';
import { errorRes, successRes } from '../../../common/interface/response';
import WithdrawController from './withdraw.controller';

const router = express.Router();
const withdrawController = new WithdrawController();

router.delete('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.send(errorRes({ message: 'userId는 필수입니다.' }));

    return;
  }

  const { error } = await withdrawController.withdraw({ userId });

  if (error) {
    res.send(errorRes({ message: error.message }));

    return;
  }

  res.send(
    successRes({
      message: '회원탈퇴 성공',
    }),
  );
});

export default router;
