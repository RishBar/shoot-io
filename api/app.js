// load .env data into process.env
require('dotenv').config();
const PORT       = process.env.PORT || 8081;
const ENV        = process.env.ENV || "development";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require("path");
const bodyParser = require('body-parser')
const users_model = require('./users_model')
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));


const players = {};
bullet = {};
hit = {};
let playerName = "";

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.get('/index', function (req, res) {
  const cookieId = req.session.userId
  if (!cookieId) {
    res.send("LOGIN FIRST")
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  users_model.getUserWithUsername(username)
    .then(user => {
      if (!user) {
        res.send("Username or password doesn't exist")
      }
      else if (bcrypt.compareSync(password, user.hashed_password)) {
        req.session.userId = user.id;
        console.log(`you have successfully logged in as ${user.username}`);
        playerName = user.username
        res.send("LOGGED IN! CLICK THE 'PLAY' BUTTON");
      } else {
        res.send("Username or password doesn't exist")
      }
    })
    .catch(e => console.log(e));
});

app.post('/users', (req, res) => {
  const username = req.body.username;
  const hashed_password = bcrypt.hashSync(req.body.password, 12);
  users_model.createUser({username: username, hashed_password: hashed_password})
  .then(response => {
    if (response) {
      res.status(200).send("Account was created. Now Login");
    } else {
      res.status(200).send("Could not create account");
    }
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

var ammoLocation = {
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 700) + 50,
  Id: 1
};

io.on('connection', function (socket) {
console.log('a user connected');
// create a new player and add it to our players object
players[socket.id] = {
  rotation: 0,
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 500) + 50,
  count: 20,
  playerId: socket.id
};
// send the players object to the new player
socket.emit('currentPlayers', players);
socket.emit('addAmmo', ammoLocation);
socket.emit('bulletLocation', bullet)
// update all other players of the new player
socket.broadcast.emit('newPlayer', players[socket.id]);

// when a player disconnects, remove them from our players object
socket.on('disconnect', function () {
  console.log('user disconnected');
  // remove this player from our players object
  delete players[socket.id];
  // emit a message to all players to remove this player
  io.emit('disconnect', socket.id);
});
// when a player moves, update the player data
socket.on('playerMovement', function (movementData) {
  players[socket.id].x = movementData.x;
  players[socket.id].y = movementData.y;
  players[socket.id].rotation = movementData.rotation;
  // emit a message to all players about the player that moved
  socket.broadcast.emit('playerMoved', players[socket.id]);
});
socket.on('playerShoot', function (bulletData) {
  bullet[socket.id] = {bulletId: bulletData.bulletId, playerId: socket.id, bulletX: bulletData.bulletX, bulletY: bulletData.bulletY, shipX: bulletData.shipX, shipY: bulletData.shipY}
  socket.broadcast.emit('playerShot', bullet[socket.id]);
});
socket.on('bulletHit', function (hitData) {
  hit[socket.id] = {playerId: hitData.playerId, player: hitData.player, bullet: hitData.bullet, bulletId: hitData.bulletId}
  // emit a message to all players about the bullet
  socket.broadcast.emit('bulletCollided', hit[socket.id]);
});
socket.on('playerDied', function (deadPlayerData) {
  socket.broadcast.emit('PlayerIsDead', deadPlayerData.playerId)
})
socket.on('ammoCollected', function (ammoData) {
  ammoLocation.x = ammoData.x
  ammoLocation.y = ammoData.y
  //ammoLocation.Id = Math.floor(Math.random() * 700) + 50;
  socket.broadcast.emit('ammoIsCollected', { ammoId: ammoData.ammoId, ammoLocation: ammoLocation } )
})
socket.on('newAmmoData', function () {
  ammoLocation.x = Math.floor(Math.random() * 700) + 50;
  ammoLocation.y = Math.floor(Math.random() * 700) + 50;
  ammoLocation.Id = Math.floor(Math.random() * 700) + 50;
  socket.broadcast.emit('newAmmoAdded', ammoLocation);
})
socket.on('ammoDropped', function (droppedAmmoData) {
  socket.broadcast.emit('createNewAmmo', {x: droppedAmmoData.xPos, y: droppedAmmoData.yPos, Id: droppedAmmoData.ammoId, count: droppedAmmoData.ammoCount});
})
socket.on('countAmmo', function (countAmmoData) {
  players[socket.id].count = countAmmoData.count;
  socket.broadcast.emit('updateAmmoCount', {playerId: countAmmoData.Id, count: countAmmoData.count});
})
socket.on('reset', function (resetPlayerData) {
  socket.broadcast.emit('resetPlayer', {x: resetPlayerData.x, y: resetPlayerData.y, playerId: resetPlayerData.playerId});
});
});

server.listen(PORT, function () {
  console.log(`game app listening on port ${PORT}`);
});