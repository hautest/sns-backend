import { createServer } from 'http';
import express from 'express';
import router from './api/auth/signUp/signUp';
import emailRouter from './api/auth/email/email';
import accessTokenRouter from './api/auth/access-token/access-token';

const app = express();
const server = createServer(app);

app.use(express.json());

// auth
app.use('/sign-up', router);
app.use('/email', emailRouter);
app.use('/access-token', accessTokenRouter);

server.listen(4000, () => {
  console.log(`Server running in 4000`);
});
