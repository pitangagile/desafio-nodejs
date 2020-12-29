import { db } from './db/index.js';
import { app } from './routes/userRoutes.js';
import dotenv from 'dotenv';
// import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();
global.BR_OFFSET = 3*60*60*1000;

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Databse connected');
  } catch (error) {
    console.log('Database error', error);
  }
})();

// const swaggerDefinition = {
//   info: {
//     title: 'Node Swagger API',
//     version: '1.0.0',
//     description: 'Demonstrating how to describe a RESTful API with Swagger',
//   },
//   host: 'localhost:3000',
//   basePath: '/',
// };
// const options = {
//   // import swaggerDefinitions
//   swaggerDefinition: swaggerDefinition,
//   // path to the API docs
//   apis: ['./routes/*.js'],
// };
// const swaggerSpec = swaggerJsdoc(options);

// app.get('/', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  try {
    console.log('API started');
  } catch (error) {
    console.log('API error', error);
  }
});