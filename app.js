require('dotenv').config()

const express = require('express')
const SignUpValidator = require('./source/signingValidator/SignUpValidator')
const SignInValidator = require('./source/signingValidator/SignInValidator')
const DataBaseManager = require('./source/DataBaseManager')
const UserAuthorizer = require('./source/UserAuthorizer')
const UserAuthenticator = require('./source/UserAuthenticator')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000


app.post('/signup', async (req, res) => {
	let data = req.body

  	let signUpValidator = new SignUpValidator()
  	if(signUpValidator.hasInvalidField(data)){
    	res.status(400).send(errorResponse('Invalid fields', 400))
    	return;
  	}
  	if(signUpValidator.hasMissingField(data)){
    	res.status(400).send(errorResponse('Missing fields', 400))
    	return;
  	}
	if(await signUpValidator.emailAlreadyExists(data['email'])){
    	res.status(400).send(errorResponse('E-mail already exists', 400))
    	return;
	}

    let authorizer = new UserAuthorizer()
    let refreshToken = await authorizer.generateRefreshToken(data)
    data['refreshToken'] = refreshToken
    // TO DO
    //data['created_at']
    //data['last_login']

    let databaseManager = new DataBaseManager()
    databaseManager.put(data)

    let response = {token: refreshToken}

  	res.status(200).send(response)
})


app.post('/signin', async (req, res) => {
  	let data = req.body

  	let signInValidator = new SignInValidator()
  	if(signInValidator.hasInvalidField(data)){
    	res.status(400).send(errorResponse('Invalid fields', 400))
    	return;
  	}
  	if(signInValidator.hasMissingField(data)){
    	res.status(400).send(errorResponse('Missing fields', 400))
    	return;
  	}

    let authenticator = new UserAuthenticator()
    let isAuthentic = await authenticator.isAuthentic(data)
    if(!isAuthentic){
        res.status(401).send(errorResponse('Invalid e-mail or password', 401))
        return;
    }

    let authorizer = new UserAuthorizer()
    let accessToken = await authorizer.generateAccessToken(data)
  
    let response = {token: accessToken}

  	res.status(200).send(response)
})


app.get('/me', async (req, res) => {
    // To DO
    // REFRESH TOKEN
    let token = req.headers.token

    let authorizer = new UserAuthorizer()
    let userData = await authorizer.authorizeAccesToken(token)
    if(userData == 401){
        res.status(401).send(errorResponse('Unauthorized', 401))
        return;
    }
    if(userData == 403){
        res.status(403).send(errorResponse('Unauthorized - invalid session', 403))
        return;
    }

    delete userData['_id']
    delete userData['refreshToken']
    delete userData['password']

    return res.status(200).send(userData)
})


app.get('*', function(req, res){
  	res.status(404).send(errorResponse('Url path not found', 404))
});


errorResponse = (message, errorCode) =>{
  	response = {}
  	response['message'] = message
  	response['errorCode'] = errorCode
  	return response
}


app.listen(port, () => {
  	console.log(`Example app listening at http://localhost:${port}`)
})