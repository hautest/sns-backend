import express from 'express';
import SignUpController from './signUp.controller';
import { errorRes, successRes } from '../../../common/interface/response';

const router = express.Router();
const signUpController = new SignUpController();

router.post('/', async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email) {
    res.send(errorRes({ message: '이메일을 입력해주세요' })).status(400);

    return;
  }

  if (!password) {
    res.send(errorRes({ message: '비밀번호를 입력해주세요' })).status(400);

    return;
  }

  if (!nickname) {
    res.send(errorRes({ message: '닉네임을 입력해주세요' })).status(400);

    return;
  }

  const { errorMessage, data } = await signUpController.signUp({
    email,
    password,
    nickname,
  });

  if (errorMessage) {
    res.send(errorRes({ message: errorMessage })).status(400);

    return;
  }

  res.send(successRes({ message: '회원가입 성공', ...data })).status(200);
});

export default router;
