const bcrypt = require('bcrypt')
const User = require("../models/user.js")
const auth = require('./auth.js')

module.exports = {

  SignUp: async (req, res) => {

    try{
        
      let newUser = await User.create(req.body)
  
      let jwt = await auth.sign(newUser.toJSON())
  
      return res.status(201).json({ token: jwt })
        
    } catch (err) {
      console.log(err)
      return res.status(400).json({ 
        message: 'Registration Failed', 
        errorCode: 400
      })
    }

  },

  SignIn: async (req, res) => {

    let { email, password } = req.body

    let user = await User.findOne({ email: email }).select('+password')

    if(user && await bcrypt.compare(password, user.password)){

      await User.updateOne({ _id: user._id }, { lastLoginAt: Date.now() }, function(err, ret){
        if(err){
          console.log(err)
          return res.status(500).json({ 
            message: "Internal Error",
            errorCode: 500
          })
        }
      })

      let jwt = await auth.sign(user.toJSON())
    
      return res.status(200).json({
        token: jwt
      })

    }
    else{

      return res.status(401).json({
        message: "Invalid e-mail or password",
        errorCode: 401
      })

    }
  },

  Me: async (req, res) => {
  
    let user = await User.findById(res.locals.id, { _id: false })

    if(user)
      res.status(200).json(user)
    else{
      res.status(404).json({
        message: "User not found",
        errorCode: 404
      })
    }
    
  }
}