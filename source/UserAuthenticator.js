const DataBaseManager = require("./DataBaseManager")

class UserAuthenticator{
    constructor(){}

    isAuthentic = async user =>{
        let email = user.email
        let password = user.password // TO DO : ENCRYPT
        let dataBaseManager = new DataBaseManager()
        let dataBaseQuery = {email: email}
        let userData = await dataBaseManager.get(dataBaseQuery)
        if(userData == null)
            return false;
        if(userData.password != password)
            return false;
        return true;
    }
}

module.exports = UserAuthenticator