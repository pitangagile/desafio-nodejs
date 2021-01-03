require('dotenv').config()

const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const expireTime = process.env.EXPIRETIME

module.exports = {

    sign: (payload) => {

        return jwt.sign(payload, secret, { expiresIn: 600 })

    },

    verify: (token) => {

      try{
        
        const verify = jwt.verify(token, secret)

        return [0, verify]

      } catch (e){

        return [1, "Unauthorized - invalid session"]
      
      }
    },
}