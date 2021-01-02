const app = require('./src/app')

app.listen(process.env.API_PORT, function(){
  console.log(process.env.API_NAME + ' ON ' + process.env.API_PORT)
});
