const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');
const errorResponse = require('../utils/errorResponse');

// sign user informations to generate a new token
const _generateUserToken = (userId) => {
  return jwt.sign({
    role: 'user',
    object_id: userId
  }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
}

const signUp = async function(req, res, next) {
  const userWithEmail = await UserModel.findOne({ email: req.body.email }).exec();

  if (!userWithEmail) {
    const saltRounds = 10;

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) next(errorResponse()); // Undefined error

      const nowDate = Date.now();

      // create new user with the hashed password
      const newUser = new UserModel({
        ...req.body,
        password: hash,
        created_at: nowDate,
        last_login: nowDate
      });

      newUser.save()
        .then((document) => {
          // generate a token with 1 day duration
          const token = _generateUserToken(document._id);

          res.json({
            token
          });
        })
        .catch((err) => {
          next(errorResponse(err.message, 500));
        });
    });
  } else {
    next(errorResponse('E-mail already exists', 400));
  }
}

const signIn = async function(req, res, next) {
  const loggedUser = await UserModel.findOne({ email: req.body.email }).exec();

  if (loggedUser) {
    const passwordMatch = await bcrypt.compare(req.body.password, loggedUser.password);
    
    if (passwordMatch) {
      loggedUser.last_login = Date.now();
      await loggedUser.save();
      
      const token = _generateUserToken(loggedUser._id);

      res.json({
        token
      });
      return;
    }
  }

  next(errorResponse("Invalid e-mail or password", 401));
}

const me = async function(req, res, next) {
  const token = req.get("Authorization");

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.object_id;
      const user = await UserModel.findById(userId).exec();

      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phones: user.phones,
        created_at: user.created_at,
        last_login: user.last_login
      })

    } catch(err) {
      next(errorResponse("Unauthorized - invalid session", 401));
    }
  } else {
    next(errorResponse("Unauthorized", 401));
  }
}


module.exports = {
  signUp,
  signIn,
  me
}