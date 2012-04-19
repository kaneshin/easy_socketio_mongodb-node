// schema.js
var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost:27017/easy')
  , Schema = mongoose.Schema
  , EasySchema = new Schema({
      title: String
    , description: String
    , date: Date
  })
;

mongoose.model('Easy', EasySchema);

module.exports = db.model('Easy');

