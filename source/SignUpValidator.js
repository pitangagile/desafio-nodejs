const SigningValidator = require("./SigningValidator");

class SignUpValidator extends SigningValidator{
    
  constructor(){
    super()
		this.validKeys = ['firstName', 'lastName', 'email', 'password', 'phones']
		this.expectedTypes = ['string', 'string', 'string', 'string', 'object']
		this.phoneValidKeys = ['number', 'area_code', 'country_code']
		this.phoneExpectedTypes = ['number', 'number', 'string']
  }

  invalidSignUp = data => {
		if(this.hasInvalidKey(data, this.validKeys, this.expectedTypes))
			return true
		
		if('phones' in data)
			for(const phone of data['phones'])
				if(this.hasInvalidKey(phone, this.phoneValidKeys, this.phoneExpectedTypes))
					return true
	
		return false
  }

	missingField = data => {
		if(this.missingKey(data, this.validKeys))
			return true
		
		if(data['phones'].length < 1)
			return true

		for(const phone of data['phones'])
			if(this.missingKey(phone, this.phoneValidKeys))
				return true

		return false
	}

}

module.exports = SignUpValidator