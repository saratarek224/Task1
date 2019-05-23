const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
//////////////////////////////////////////////////
//user schema
const userSchema = new Schema({
  first_name: {
    type: String,
    required: [true, 'User first name required'],
  },
  last_name: {
    type: String,
    required: [true, 'User last name required'],
  },
  country_code: {
    type: String,
    required: [true, 'User country code required'],
  },
  gender: {
    type: String,
    required: [true, 'User gender required'],
    enum: ['Male', 'Female']
  },
  phone_number:
  //validate against phone number format
  {
    type: String,
    unique: [true, 'taken'],
    minlength: [11, "too_short"],
    maxlength: [14, "too_long"],
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  birthdate: {
    type: Date,
    max: [Date.now, 'in the future'],
    required: [true, 'User birthdate required'],
  },
  email: {
    type: String,
    required: false,
    unique: [true, 'taken'],
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  }

  ,
  avatar: {
    //file
    type: String,
    required: [true, 'User image required'],

  },
  password: {
    type: String,
    require: true,
    minlength: 1
  },


});

///////////////////////////////////////////////////////
//generate token for a user
userSchema.methods.generateAuthToken = function () {
  const user = this;
  var token = jwt.sign({
    user
  }, 'secret', {
    expiresIn: '24h'
  });


  return user.save().then(() => {
    return token;
  });
};
//////////////////////////////////////////////////////////////////
//find user by phone for login
userSchema.statics.findByPhone = function (phone_number, password) {
  var User = this;

  return User.findOne({
    phone_number
  }).then((user) => {
    console.log(user);
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      if (password == user.password) {
        resolve(user);
      } else {
        reject();
      }
    });
  });
};

/////////////////////////////////////////////////////////
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;