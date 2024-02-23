import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import signUpRouter from './api/auth/signUp/signUp';
import emailRouter from './api/auth/email/email';
import accessTokenRouter from './api/auth/access-token/access-token';
import signInRouter from './api/auth/signIn/signIn';
import postRouter from './api/post/post';
import commentRouter from './api/comment/comment';
import likeRouter from './api/like/like';
import myRouter from './api/my/my';
import withDrawRouter from './api/auth/withdraw/withdraw';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());

// auth
app.use('/sign-up', signUpRouter);
app.use('/email', emailRouter);
app.use('/access-token', accessTokenRouter);
app.use('/sign-in', signInRouter);
app.use('/withdraw', withDrawRouter);

// post
app.use('/post', postRouter);
// comment
app.use('/comment', commentRouter);
// like
app.use('/', likeRouter);
// my
app.use('/my', myRouter);

server.listen(4000, () => {
  console.log(`Server running in 4000`);
});
