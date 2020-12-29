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
      number: Number,
      area_code: Number,
      country_code: String
    }],
    created_at: {
      type: Date,
    },
    last_login: {
      type: Date,
    }
  });

  userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    const timestamp = new Date().getTime();
    const dateBr = new Date(timestamp - BR_OFFSET);
    this.created_at = dateBr;
    this.last_login = dateBr;
    
    next();
  });

  const model = mongoose.model('users', userSchema);
  return model;
};

export { userModel };