const mongoose = require('mongoose');

const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  created_at: Date,
  last_login: Date,
  phones: [
    {
      number: Number,
      area_code: Number,
      country_code: String
    }
  ]
});

module.exports = User;