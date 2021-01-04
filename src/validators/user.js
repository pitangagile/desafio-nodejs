const yup = require('yup');
const errorResponse = require('../utils/errorResponse');

const signUpRequest = async (req, res, next) => {
  let phoneSchema = yup.object().shape({
    number: yup.number().required(),
    area_code: yup.number().required(),
    country_code: yup.string().required().matches(/\+\d*/)
  });

  let signUpSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    phones: yup.array().of(phoneSchema).required().min(1)
  });

  await signUpSchema.validate(req.body)
    .then((value) => {
      req.body = value; // Validation includes a cast to proper types
      next();
    }).catch((err) => {
      next(errorResponse(err.message, 400));
    });
}

const signInRequest = async (req, res, next) => {
  let signInRequest = yup.object().shape({
    email: yup.string().required().min(1),
    password: yup.string().required().min(1)
  });

  await signInRequest.validate(req.body)
    .then((value) => {
      req.body = value;
      next();
    }).catch((err) => {
      next(errorResponse("Missing fields", 400));
    })
}

module.exports = {
  signUpRequest,
  signInRequest,
}