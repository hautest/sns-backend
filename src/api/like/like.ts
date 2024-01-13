import express from 'express';
import { errorRes, successRes } from '../../common/interface/response';
import LikeController from './like.controller';

const router = express.Router();
const likeController = new LikeController();

router.post('/like', async (req, res) => {
  const { post_id } = req.body;
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

  if (!post_id || typeof post_id !== 'string') {
    res
      .send(
        errorRes({
          message: 'post_id를 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { error } = await likeController.like({
    accessToken,
    post_id: Number(post_id),
  });

  if (error) {
    res
      .send(
        errorRes({
          message: `좋아요에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes()).status(200);
});

router.post('/unlike', async (req, res) => {
  const { post_id } = req.body;
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

  if (!post_id || typeof post_id !== 'string') {
    res
      .send(
        errorRes({
          message: 'post_id를 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { error } = await likeController.unlike({
    accessToken,
    post_id: Number(post_id),
  });

  if (error) {
    res
      .send(
        errorRes({
          message: `좋아요 삭제에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes()).status(200);
});

export default router;
