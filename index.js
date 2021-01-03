const app = require('./src/app.js')

app.listen(process.env.PORT || 4000 , function(){
  console.log(process.env.API_NAME + ' ON ' + ( process.env.PORT || 4000 ))
});
