import express from 'express';
import { errorRes, successRes } from '../../common/interface/response';
import CommentController from './comment.controller';

const router = express.Router();
const commentController = new CommentController();

router.post('/', async (req, res) => {
  const { comment, post_id } = req.body;
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

  if (!comment || typeof comment !== 'string') {
    res
      .send(
        errorRes({
          message: 'comment를 입력해주세요',
        }),
      )
      .status(400);

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

  const { data, error } = await commentController.create({
    accessToken,
    comment,
    post_id: Number(post_id),
  });

  if (error) {
    res
      .send(
        errorRes({
          message: `댓글 작성에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes(data)).status(200);
});

export default router;
