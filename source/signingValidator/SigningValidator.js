//@abstract
class SigningValidator{

	constructor(){
    	if(new.target === SigningValidator)
      		throw new Error("Can't instantiate abstract class SigningValidator.");
  	}

  	hasMissingKey = (data, validKeys) => {
    	for(const key of validKeys)
      		if(!(key in data))
        		return true;

    	return false;
	}

	hasInvalidKey = (data, validKeys, expectedTypes) => {
    	for(const key of Object.keys(data)){
    		if(!validKeys.includes(key))
        		return true;
      		let type = typeof data[key]
      		let i = validKeys.indexOf(key)
      		let expectedType = expectedTypes[i]
      		if(type != expectedType)
        		return true;
    	}
    
    	return false;
  	}

}

module.exports = SigningValidator