const jwt = require('jsonwebtoken')
const DataBaseManager = require('./DataBaseManager')
const User = require('./User')

class UserAuthorizer{
    constructor(){}

    generateAccessToken = async user => {
        let tokenData = {email: user.userData.email}
        return jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
    }

    generateRefreshToken = async user => {
        let tokenData = {email: user.userData.email}
        return jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET)
    }

    getUserByAuthorization = async token => {
        if(token == null) return 401
        try{
            let tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            let dataBaseManager = new DataBaseManager()
            let query = {email: tokenData.email}
            let userData = await dataBaseManager.get(query)
            let user = new User()
            await user.init(userData)

            return user
        }
        catch(err){
            return 403
        }
    }
    
}

module.exports = UserAuthorizer