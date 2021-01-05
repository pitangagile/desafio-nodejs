// Setup dotenv
require('dotenv').config();

const app = require('./app.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Pitang Desafio Node JS is running at http://localhost:${port}`);
});