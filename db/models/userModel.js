import bcrypt from 'bcryptjs';

const userModel = (mongoose) => {
  const userSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      select: false,
      required: true
    },
    phones: [{
      _id: false,
      number: Number,
      area_code: Number,
      country_code: String
    }],
    created_at: {
      type: Date,
      default: Date.now
    },
    last_login: {
      type: Date,
      default: Date.now
    } 
  },{versionKey: false});

  userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  });

  const model = mongoose.model('users', userSchema);
  return model;
};

export { userModel };