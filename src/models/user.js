const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true        
    },
    password: {
        type: String,
        required: true
    },
    phones: [
        {
          number: {
            type: Number
          },
          area_code: {
            type: Number
          },
          country_code: {
            type: String
          }
        }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }

})

const User = mongoose.model('User', UserSchema)

module.exports = User