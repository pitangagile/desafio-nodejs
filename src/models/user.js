const mongoose = require('../database/database.js')
const bcrypt = require('bcrypt')

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
        required: true,
        select: false
    },
    phones: [
        {
          _id: false,
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

},{versionKey: false})

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = mongoose.model('User', UserSchema)

module.exports = User