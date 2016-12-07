const express = require('express');
const mongoose = require('mongoose');
const app = express();

console.info(`Starting test in environment ${process.env.NODE_ENV}`);

var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

app.get('/', function (req, res) {
  Kitten.find({ name: 'my_kitten' })
  .then((kitten) => {
    console.log(kitten);
    res.json(kitten);
  })
  .catch((err) => {
    res.json(err);
  })
});

const listen = () => {
  app.listen(3000, () => console.info('Listening on port 3000!'));
}

// mongoose connection
const mongoHosts = process.env.MONGO_MAIN_HOSTS;
const connStr = `mongodb://${mongoHosts}/kittens`;

mongoose.Promise = require('bluebird');
const connectDB = () => {
  mongoose.connect(connStr, { server: { auto_reconnect: true, reconnectTries: Number.MAX_VALUE } })
    .then(() => console.info('Connected to database!'))
    .catch(err => console.error(err));
}
const db = mongoose.connection
db.on('error', (err) => {
  console.error(err);
});

db.on('disconnected', function() {
  console.warn('MongoDB disconnected!');
});

db.on('connected', function() {
  console.info('MongoDB connected!');
});

db.on('reconnected', function() {
  console.warn('MongoDB reconnected!');
});

db.once('open', () => {
  listen();
})
connectDB();

module.exports = app;
