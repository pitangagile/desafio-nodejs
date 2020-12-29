import express from 'express';
import cors from 'cors';
import { signup, signin, getUser } from './userController.js';
import middleware from './middleware.js';

const app = express();
app.use(cors())
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Desafio Pitang');
});

app.post('/signup', signup);

app.post('/signin', signin);

app.get('/me', middleware, getUser);

export { app };