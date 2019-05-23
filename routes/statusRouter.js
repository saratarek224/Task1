const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');
const Status = require('../models/status');
const jwt = require('jsonwebtoken');


router.post('/create', (req, res) => {
  const body = _.pick(req.body, ['phone_number', 'auth-token', 'status']);
  User.find({
    phone_number: body.phone_number
  }).then((user) => {
    console.log(user);
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      jwt.verify(body["auth-token"], 'secret', (err, authData) => {
        if (err) {
          res.sendStatus(403);
          reject();
        } else {
          const status = new Status({
            status: body.status,
            user: user,
          })
          status.save((err) => {
            if (!err) res.send('status was saved created')
          })
          resolve();
        }
      });
    });
  });

});



module.exports = router;