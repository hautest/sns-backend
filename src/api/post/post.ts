import express from 'express';
import PostController from './post.controller';
import { errorRes, successRes } from '../../common/interface/response';

const router = express.Router();
const postController = new PostController();

router.post('/', async (req, res) => {
  const accessToken = req.headers.authorization;
  const { content, title } = req.body;
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
  if (!content || typeof content !== 'string') {
    res
      .send(
        errorRes({
          message: 'content를 입력해주세요',
        }),
      )
      .status(400);

    return;
  }
  if (!title || typeof title !== 'string') {
    res
      .send(
        errorRes({
          message: 'title을 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { error, data } = await postController.create({
    accessToken,
    content,
    title,
  });

  if (error) {
    res
      .send(
        errorRes({
          message: `게시글 작성에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes(data[0])).status(200);
});

router.get('/', async (req, res) => {
  const { cursor, limit } = req.query;
  const cursorNumber = Number(cursor) ?? 0;
  const limitNumber = Number(limit) ?? 10;

  const { data, error } = await postController.findAll({
    cursor: cursorNumber,
    limit: limitNumber,
  });

  if (error) {
    res
      .send(
        errorRes({
          message: `게시글 조회에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes({ data })).status(200);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await postController.findOne(id);

  if (error) {
    res
      .send(
        errorRes({
          message: `게시글 조회에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes({ data })).status(200);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const accessToken = req.headers.authorization;

  if (accessToken === undefined) {
    res
      .send(
        errorRes({
          message: '본인의 글만 삭제할 수 있습니다',
        }),
      )
      .status(401);

    return;
  }

  if (!id || typeof id !== 'string') {
    res
      .send(
        errorRes({
          message: 'id를 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { error } = await postController.delete({ id, accessToken });

  if (error) {
    res
      .send(
        errorRes({
          message: `게시글 삭제에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  res.send(successRes()).status(200);
});

export default router;
