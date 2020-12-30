import db from './db/index.js';
import { app } from './routes/userRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, err => {
  if (err) {
    console.log('Database error', err);
  } else {
    console.log('Databse connected');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  try {
    console.log('API started');
  } catch (error) {
    console.log('API error', error);
  }
});