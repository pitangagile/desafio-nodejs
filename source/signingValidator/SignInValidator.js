const SigningValidator = require("./SigningValidator");

class SignInValidator extends SigningValidator{

	constructor(){
		super()
		this.validKeys = ['email', 'password']
		this.expectedTypes = ['string', 'string']
	}

	hasInvalidField = data => {
		return this.hasInvalidKey(data, this.validKeys, this.expectedTypes)
	}

	hasMissingField = data => {
		return this.hasMissingKey(data, this.validKeys)
	}

}

module.exports = SignInValidator