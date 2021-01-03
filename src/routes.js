const { Router } = require('express')
const validate = require('./middleware/validate.js')
const controller = require('./controller/index.js')

const routes = Router();

routes.get("/", function(req, res){
  res.status(200).json({
    message: "It works!"
  })
})

routes.post("/signup", validate.SignUp(), controller.SignUp)

routes.post("/signin", validate.SignIn(), controller.SignIn)

routes.get("/me", validate.Me(), controller.Me)

module.exports = routes

