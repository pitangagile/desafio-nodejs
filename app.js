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

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "LogRocket Express API with Swagger",
//       version: "0.1.0",
//       description:
//         "This is a simple CRUD API application made with Express and documented with Swagger",
//     },
//     servers: [
//       {
//         url: "https://desafio-pitang-fl.herokuapp.com/",
//       },
//     ],
//   },
//   apis: ['./routes/userRoutes.js'],
// };

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

// const specs = swaggerJsdoc(options);
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(specs)
// );

const port = process.env.PORT || 3000;
app.listen(port, () => {
  try {
    console.log('API started');
  } catch (error) {
    console.log('API error', error);
  }
});