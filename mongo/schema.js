const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { type: Number, unique: true },
  username: { type: String, unique: true},
  highscore: { type: Number },
  mode: { type: String }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
