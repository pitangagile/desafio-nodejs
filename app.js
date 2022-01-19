const express = require('express')
const SignUpValidator = require('./source/SignUpValidator')
const SignInValidator = require('./source/SignInValidator')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000


app.post('/signup', (req, res) => {
  let data = req.body

  let signUpValidator = new SignUpValidator()
  if(signUpValidator.invalidSignUp(data)){
    res.status(400).send(errorResponse('Invalid fields', 400))
    return;
  }
  if(signUpValidator.missingField(data)){
    res.status(400).send(errorResponse('Missing fields', 400))
    return;
  }
  
  res.send('Hello World!')
})


app.post('/signin', (req, res) => {
  let data = req.body

  let signInValidator = new SignInValidator()
  if(signInValidator.invalidSignIn(data)){
    res.status(400).send(errorResponse('Invalid fields', 400))
    return;
  }
  if(signInValidator.missingField(data)){
    res.status(400).send(errorResponse('Missing fields', 400))
    return;
  }
  
  res.send('Hello World!')
})


app.get('*', function(req, res){
  res.status(404).send(errorResponse('Path to not found', 404))
});


function errorResponse(message, errorCode){
  response = {}
  response['message'] = message
  response['errorCode'] = errorCode
  return response
}


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})