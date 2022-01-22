require('dotenv').config()

const express = require('express')
const SignUpValidator = require('./source/signingValidator/SignUpValidator')
const SignInValidator = require('./source/signingValidator/SignInValidator')
const UserAuthorizer = require('./source/UserAuthorizer')
const UserAuthenticator = require('./source/UserAuthenticator')
const User = require('./source/User')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000


app.post('/signup', async (req, res) => {
	let data = req.body

  	let signUpValidator = new SignUpValidator()
  	if(signUpValidator.hasInvalidField(data))
    	return res.status(400).send(errorResponse('Invalid fields', 400))
  	if(signUpValidator.hasMissingField(data))
    	return res.status(400).send(errorResponse('Missing fields', 400))
	if(await signUpValidator.emailAlreadyExists(data['email']))
    	return res.status(400).send(errorResponse('E-mail already exists', 400))

    let user = new User()
    await user.init(data)

    let authorizer = new UserAuthorizer()
    let refreshToken = await authorizer.generateRefreshToken(user)
    user.addRefreshToken(refreshToken)

    let authenticator = new UserAuthenticator()
    authenticator.hashUserPassword(user)

    await user.pushToDB()

    let response = {token: refreshToken}

  	res.status(200).send(response)
})


app.post('/signin', async (req, res) => {
  	let data = req.body

  	let signInValidator = new SignInValidator()
  	if(signInValidator.hasInvalidField(data))
    	return res.status(400).send(errorResponse('Invalid fields', 400))
  	if(signInValidator.hasMissingField(data))
    	return res.status(400).send(errorResponse('Missing fields', 400))

    let authenticator = new UserAuthenticator()
    let user = await authenticator.getUserByAuthentication(data)
    if(user == null){
        res.status(401).send(errorResponse('Invalid e-mail or password', 401))
        return;
    }

    user.updateLastLogin()

    let authorizer = new UserAuthorizer()
    let accessToken = await authorizer.generateAccessToken(user)
    let response = {token: accessToken}

  	res.status(200).send(response)
})


app.get('/me', async (req, res) => {
    // To DO
    // REFRESH TOKEN
    // ...
    // It's not clear how I should do it, so I didn't
    let token = req.headers.token

    let authorizer = new UserAuthorizer()
    let user = await authorizer.getUserByAuthorization(token)
    if(user == 401)
        return res.status(401).send(errorResponse('Unauthorized', 401))
    if(user == 403)
        return res.status(403).send(errorResponse('Unauthorized - invalid session', 403))

    user.updateLastLogin()

    let userData = user.userData
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
  	console.log(`Listening at http://localhost:${port}`)
})