const app = require('./src/app')

app.listen(process.env.PORT || 4000 , function(){
  console.log(process.env.API_NAME + ' ON ' + ( process.env.PORT || 4000 ))
});
