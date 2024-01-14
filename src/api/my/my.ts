import express from 'express';

import { errorRes, successRes } from '../../common/interface/response';
import MyController from './my.controller';

const router = express.Router();
const myController = new MyController();

router.get('/', async (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res
      .send(
        errorRes({
          message: '로그인이 필요합니다',
        }),
      )
      .status(401);

    return;
  }

  const result = await myController.getMyInfo({ accessToken });

  if (result.error) {
    res.send(errorRes({ message: result.error.message })).status(400);

    return;
  }

  res.send(successRes({ ...result.data })).status(200);
});

router.get('/post', async (req, res) => {
  const accessToken = req.headers.authorization;
  const { cursor, limit } = req.query;

  if (!accessToken) {
    res
      .send(
        errorRes({
          message: '로그인이 필요합니다',
        }),
      )
      .status(401);

    return;
  }

  const result = await myController.getMyPosts({
    accessToken,
    cursor: Number(cursor) ?? 0,
    limit: Number(limit) ?? 10,
  });

  if (result.error) {
    res.send(errorRes({ message: result.error.message })).status(400);

    return;
  }

  res.send(successRes({ data: result.data })).status(200);
});

export default router;
