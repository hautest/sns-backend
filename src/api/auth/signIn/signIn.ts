import express from 'express';
import { errorRes, successRes } from '../../../common/interface/response';
import SignInController from './signIn.controller';

const router = express.Router();
const signInController = new SignInController();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    res
      .send(
        errorRes({
          message: '이메일을 입력해주세요',
        }),
      )
      .status(400);
    return;
  }

  if (!password || typeof password !== 'string') {
    res
      .send(
        errorRes({
          message: '비밀번호를 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { data, error } = await signInController.signIn(email, password);

  if (error) {
    res
      .send(
        errorRes({
          message: `로그인에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  const { access_token, refresh_token } = data?.session || {};

  res
    .send(
      successRes({
        accessToken: access_token,
        refreshToken: refresh_token,
      }),
    )
    .status(200);
});

export default router;
