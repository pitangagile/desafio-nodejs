const express = require('express')
const SignUpValidator = require('./source/signingValidator/SignUpValidator')
const SignInValidator = require('./source/signingValidator/SignInValidator')
const DataBaseManager = require('./source/DataBaseManager')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000


app.post('/signup', async (req, res) => {
	let data = req.body

  	let signUpValidator = new SignUpValidator()
  	if(signUpValidator.invalidField(data)){
    	res.status(400).send(errorResponse('Invalid fields', 400))
    	return;
  	}
  	if(signUpValidator.missingField(data)){
    	res.status(400).send(errorResponse('Missing fields', 400))
    	return;
  	}
	if(await signUpValidator.emailAlreadyExists(data['email'])){
    	res.status(400).send(errorResponse('E-mail already exists', 400))
    	return;
	}

  	res.send('Hello World!')
})


app.post('/signin', (req, res) => {
  	let data = req.body

  	let signInValidator = new SignInValidator()
  	if(signInValidator.invalidField(data)){
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
  	res.status(404).send(errorResponse('Url path not found', 404))
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