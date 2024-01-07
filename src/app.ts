import { createServer } from 'http';
import express from 'express';
import router from './api/auth/signUp/signUp';
import emailRouter from './api/auth/email/email';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use('/sign-up', router);
app.use('/email', emailRouter);

server.listen(4000, () => {
  console.log(`Server running in 4000`);
});
