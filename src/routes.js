const { Router } = require('express')
const bcrypt = require('bcrypt')

const User = require("./models/user")

const routes = Router();


const auth = require('./controller/auth')


routes.get("/", function(req, res){

  res.json({
    "message": "It works!"
  })

})

routes.post("/signup", async function(req, res){

  try{

    let { firstName, lastName, email, password, phones } = req.body

    password = await bcrypt.hash(password, 10)

    let newUser = await User.create({ firstName, lastName, email, password, phones })

    let jwt = await auth.sign(newUser.toJSON())

    return res.status(201).json({ token: jwt })

  } catch (err) {
    console.log(err)
    return res.status(400).send({ Error: 'Registration Failed'})
  }

})

routes.get("/signin", async function(req, res){

  let { email, password } = req.body

  let user = await User.findOne({ email: email })

  if(user){

    await bcrypt.compare(password, user.password, async function(err, result){

      if(err){
        return res.status(500).json({
          "message": "" + err
        })
      }

      if(result){

        await User.updateOne({ _id: user._id }, { lastLoginAt: Date.now() }, function(err, ret){
          if(err){
            return res.status(500).json({ 
              "message": "Could not update user. " + err
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
          "message": "Invalid e-mail or password"
        })

      }

    })
  
  }
  else{

    return res.status(401).json({
      "message": "Invalid e-mail or password"
    })

  }

})

routes.get("/me", async function(req, res){

  if(req.headers.authorization === undefined || req.headers.authorization == ""){

    res.status(401).json({
      "message": "Unauthorized",
      "errorCode": 401
    })

  }
  else{

    let [, token ] = req.headers.authorization.split(' ')

    let verify = auth.verify(token)

    if(verify[0] == 0){

      let user = await User.findById(verify[1]._id)

      res.status(201).json(user)

    }
    else{

      res.status(401).json({
        "message": verify[1],
        "errorCode": 401
      })

    }
  }
})

  module.exports = routes

