const mongoose = require("mongoose");
const util = require("util");
const debug = require("debug")("node-server:index");

// config should be imported before importing any other file
const config = require("./src/config");
const server = require("./src/server");
const app = require("express")();
const socketIO = require('socket.io');

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
console.log("mongo:::", mongoUri);
mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: Promise,
  useFindAndModify: false,
});

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.get("/", function (req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
var io = socketIO(server, {
  cors: {
    origins: '*:*'
  }
});

io.on('connection', (socket) => {
  socket.join("fightRoom");
  console.log('entered');

  socket.on('enter', () => {
    console.log("broadcast to everyone");
    socket.broadcast.to('fightRoom').emit('entered');
  })
});

if (!module.parent) {
  // listen on port config.port
  server.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = server;
