const mongoose = require('mongoose');
const Schema = mongoose.Schema;
///////////////////////////////////////////////////
//status schema
const statusSchema = new Schema({
  status: String,
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]

});
/////////////////////////////////////
const Status = mongoose.model('Status', statusSchema);

module.exports = Status;