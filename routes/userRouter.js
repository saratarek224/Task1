const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');
const multer = require("multer");
//////////////////////////////////////
//for upload an image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


/////////////////////////////////////////////////////////////////////////
//Login
router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['phone_number', 'password']);
  User.findByPhone(body.phone_number, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.status(201).send({
        token: token,
        user: user
      });
    });
  }).catch((e) => {
    res.status(500).send(e);
  });

});

///////////////////////////////////////////////////////////////////////
//signUP 
router.post('/signup', upload.single("avatar"), (req, res) => {
  const body = _.pick(req.body, ['first_name', 'last_name', 'country_code', 'gender', 'phone_number', 'birthdate', 'email', 'password']);
  const user = new User(body);
  console.log(req.file);
  user.avatar = req.file.path;

  user.save((err) => {
    if (!err) {
      res.status(201).send(user);
    } else {
      console.log(err);
      console.log("err");
      res.status(500).send(err);
    }
  })

});

module.exports = router;