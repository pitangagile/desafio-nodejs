const DataBaseManager = require('./DataBaseManager')
const User = require('./User')
const bcrypt = require('bcrypt');

class UserAuthenticator{
    constructor(){
        this.saltRounds = 10
    }

    hashUserPassword = user =>{
        let password = user.userData.password
        const hash = bcrypt.hashSync(password, this.saltRounds);
        user.userData.password = hash
        return user
    }

    getUserByAuthentication = async userAuthentication =>{
        let email = userAuthentication.email
        let password = userAuthentication.password
        let dataBaseManager = new DataBaseManager()
        let dataBaseQuery = {email: email}
        let userData = await dataBaseManager.get(dataBaseQuery)
        if(userData == null)
            return null
        if(!bcrypt.compareSync(password, userData.password))
            return null
        let user = new User()
        await user.init(userData)
        return user
    }
}

module.exports = UserAuthenticator