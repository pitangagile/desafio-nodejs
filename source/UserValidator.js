const SignUpValidator = require('./signingValidator/SignUpValidator')

class UserValidator{

    constructor(){}

    isValidUser = userData =>{
        return this.isValidExistingUser(userData) || this.isValidNewUser(userData)
    }

    isValidNewUser = userData =>{
        let signUpValidator = new SignUpValidator()
        if(signUpValidator.hasInvalidField(userData) || signUpValidator.hasMissingField(userData))
            return false
        return true
    }

    isValidExistingUser = userData =>{
        let copyOfUserData = userData
        delete copyOfUserData['_id']
        let signUpValidator = new SignUpValidator()
        signUpValidator.validKeys.push('refreshToken', 'created_at', 'last_login')
        signUpValidator.expectedTypes.push('string', 'object', 'object')
        if(signUpValidator.hasInvalidField(copyOfUserData) || signUpValidator.hasMissingField(copyOfUserData))
            return false
        return true
    }

}

module.exports = UserValidator