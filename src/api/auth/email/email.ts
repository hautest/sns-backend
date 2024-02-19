import express from 'express';
import EmailController from './email.controller';
import { errorRes, successRes } from '../../../common/interface/response';

const router = express.Router();

const emailController = new EmailController();

router.post('/send', async (req, res) => {
  const { email } = req.body;

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

  const { errorMessage } = await emailController.sendMail(email);
  if (errorMessage) {
    res
      .send(
        errorRes({
          message: `이메일 전송에 실패했습니다 ${errorMessage}`,
        }),
      )
      .status(400);
    return;
  }

  res.send(successRes()).status(200);
});

router.post('/verify', async (req, res) => {
  const { email, token } = req.body;

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

  if (!token || typeof token !== 'string') {
    res
      .send(
        errorRes({
          message: '인증번호를 입력해주세요',
        }),
      )
      .status(400);
    return;
  }

  const { isVerify, message } = await emailController.verifyToken(email, token);

  if (!isVerify) {
    res
      .send(
        errorRes({
          message,
        }),
      )
      .status(400);
    return;
  }

  res.send(successRes()).status(200);
});

export default router;
