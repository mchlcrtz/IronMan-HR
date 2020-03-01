const mongoose = require('mongoose')
const mongoDB = 'mongodb://localhost/pokemon';

const db = mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
