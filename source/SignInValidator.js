const SigningValidator = require("./SigningValidator");

class SignInValidator extends SigningValidator{

	constructor(){
		super()
		this.validKeys = ['email', 'password']
		this.expectedTypes = ['string', 'string']
	}

	invalidSignIn = data => {
		return this.hasInvalidKey(data, this.validKeys, this.expectedTypes)
	}

	missingField = data => {
		return this.missingKey(data, this.validKeys)
	}

}

module.exports = SignInValidator