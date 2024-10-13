const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['collector', 'user'], // User can either be 'manufacturer' or 'consumer'
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

// Pre-save middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8); // Hash password with bcrypt
  }
  next();
});

// Method to generate an auth token using JWT
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  
  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, 'process.env.JWT_SECRET', {
    expiresIn: "1h",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Method to find user by credentials (email and password)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login, user not found.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, incorrect password.");
  }

  return user;
};

// Method to check user role (for role-based access control)
userSchema.methods.isManufacturer = function () {
  return this.role === 'manufacturer';
};

userSchema.methods.isConsumer = function () {
  return this.role === 'consumer';
};

// Remove password and tokens before sending user object back in response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
