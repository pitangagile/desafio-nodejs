const DataBaseManager = require('./DataBaseManager')
const User = require('./User')
const bcrypt = require('bcrypt');

class UserAuthenticator{
    constructor(){
        this.saltRounds = 10
    }

    getUserByAuthentication = async user =>{
        let email = user.email
        let password = user.password // TO DO : ENCRYPT
        let dataBaseManager = new DataBaseManager()
        let dataBaseQuery = {email: email}
        let userData = await dataBaseManager.get(dataBaseQuery)
        if(userData == null)
            return null
        if(userData.password != password)
            return null
        let userObj = new User()
        await userObj.init(userData)
        return userObj
    }
}

module.exports = UserAuthenticator