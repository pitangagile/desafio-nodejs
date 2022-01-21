const jwt = require('jsonwebtoken')
const DataBaseManager = require('./DataBaseManager')

class UserAuthorizer{
    constructor(){}

    generateAccessToken = async user => {
        let tokenData = {email: user.email}
        return jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
    }

    generateRefreshToken = async user => {
        let tokenData = {email: user.email}
        return jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET)
    }

    authorizeAccesToken = async token => {
        if(token == null) return 401
        try{
            let tokenData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            let dataBaseManager = new DataBaseManager()
            let query = {email: tokenData.email}
            let userData = await dataBaseManager.get(query)
            
            return userData
        }
        catch(err){
            return 403
        }
    }
    
}

module.exports = UserAuthorizer