const mongoose = require("../../database/index");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phones: {
    type: Array,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  const hashed = await bcrypt.hash(this.password, 10);

  this.password = hashed;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
