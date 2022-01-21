const SigningValidator = require("./SigningValidator")
const DataBaseManager = require("../DataBaseManager")

class SignUpValidator extends SigningValidator{
    
  	constructor(){
    	super()
		this.validKeys = ['firstName', 'lastName', 'email', 'password', 'phones']
		this.expectedTypes = ['string', 'string', 'string', 'string', 'object']
		this.phoneValidKeys = ['number', 'area_code', 'country_code']
		this.phoneExpectedTypes = ['number', 'number', 'string']
  	}

  	hasInvalidField = data => {
		if(this.hasInvalidKey(data, this.validKeys, this.expectedTypes))
			return true
		
		if('phones' in data)
			for(const phone of data['phones'])
				if(this.hasInvalidKey(phone, this.phoneValidKeys, this.phoneExpectedTypes))
					return true
	
		return false
  	}

	hasMissingField = data => {
		if(this.hasMissingKey(data, this.validKeys))
			return true
		
		if(data['phones'].length < 1)
			return true

		for(const phone of data['phones'])
			if(this.hasMissingKey(phone, this.phoneValidKeys))
				return true

		return false
	}

	emailAlreadyExists = async email =>{
		let dataBaseManager = new DataBaseManager()
		let userWithGivenEmail = await dataBaseManager.get({email: email})
		if(userWithGivenEmail == null)
			return false
		return true
	}

}

module.exports = SignUpValidator