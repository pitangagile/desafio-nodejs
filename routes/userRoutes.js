import express from 'express';
import { signup, signin, getUser } from './userController.js';
import middleware from './middleware.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Desafio Pitang');
});

app.post('/signup', signup);

app.post('/signin', signin);


app.get('/me', middleware, getUser);

export { app };