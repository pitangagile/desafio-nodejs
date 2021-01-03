const yup = require('yup')
const User = require("../models/user.js")
const auth = require('../controller/auth.js')

let status

function SignUp(){

    let schema = yup.object().shape({
      firstName: yup.string().trim().required("Missing fields").min(3, "Invalid fields"),
      lastName: yup.string().trim().required("Missing fields").min(3, "Invalid fields"),
      email: yup.string().required("Missing fields").email("Invalid fields"),
      password: yup.string().trim().required("Missing fields").min(6, "Invalid fields"),
      phones: yup.array(yup.object().shape({
        number: yup. number().required("Missing fields").integer("Invalid fields"),
        area_code: yup.number().required("Missing fields").integer("Invalid fields"),
        country_code: yup.string().trim().required("Missing fields")
      }))
    });

    return async(req, res, next) => {
        try {
          await schema.validate(req.body, { abortEarly: true })

          if(await User.findOne({ email: req.body.email })){
            status = 400
            return res.status(status).json({ 
              message: "E-mail already exists",
              errorCode: status
            })
          }

          next()
        } catch (err) {
          status = 400
          res.status(status).json({
            message:err.message,
            errorCode: status
          })
        }
    }
}

function SignIn(){

  let schema = yup.object().shape({
    email: yup.string().required("Missing fields").email("Invalid fields"),
    password: yup.string().trim().required("Missing fields").min(6, "Invalid fields")
  });

  return async(req, res, next) => {
      try {
        await schema.validate(req.body, { abortEarly: true })

        next()
      } catch (err) {
        status = 400
        return res.status(status).json({
          message:err.message,
          errorCode: status
        })
      }
  }
}

function Me(){
  let schema = yup.object().shape({
    authorization: yup.string().required("Unauthorized")
  });

  return async(req, res, next) => {
      try {
        await schema.validate(req.headers, { abortEarly: true })

        let [, token ] = req.headers.authorization.split(' ')

        let verify = auth.verify(token)

        if(verify[0] == 0){

          res.locals.id = verify[1]._id

          next()

        }
        else{
          
          status = 401
          return res.status(status).json({
            "message": verify[1],
            "errorCode": status
          })

        }
      } catch (err) {
        status = 401
        return res.status(status).json({
          message:err.message,
          errorCode: status
        })
      }
  }
}

module.exports = { SignUp, SignIn, Me }