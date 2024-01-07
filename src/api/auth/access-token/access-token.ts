import express from 'express';
import { errorRes, successRes } from '../../../common/interface/response';
import AccessTokenController from './access-token.controller';

const router = express.Router();
const accessTokenController = new AccessTokenController();

router.post('/', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res
      .send(
        errorRes({
          message: 'refreshToken을 입력해주세요',
        }),
      )
      .status(400);

    return;
  }

  const { generateAccessToken } = accessTokenController;

  const { data, error } = await generateAccessToken(refreshToken);

  if (error) {
    res
      .send(
        errorRes({
          message: `토큰 갱신에 실패했습니다 ${error.message}`,
        }),
      )
      .status(400);

    return;
  }

  const { access_token } = data?.session || {};

  res.send(successRes({ data: { accessToken: access_token } })).status(200);
});

export default router;
