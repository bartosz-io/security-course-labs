const session = require('express-session');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const uuid = require('uuid');
const chalk = require('chalk');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

const sessionParser = session({
  name: 'session_id',
  secret: 'cookie_secret',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 3600000,
    sameSite: 'none' // 'lax' or 'strict'
  }
});

app.use(sessionParser);
app.use(express.static('public'));

app.post('/login', function (req, res) {

  // Build your authentication mechanism
  //
  // const login = req.body.login;
  // const password = req.body.password;
  // validate login / password

  req.session.userId = uuid.v4();
  res.sendStatus(200);
});

app.get('/logout', function (req, res) {
  req.session.userId = null;
  res.sendStatus(200);
});

server.on('upgrade', function upgrade(request, socket, head) {

  authenticate(request, (err, client) => {
    if (err || !client) {
      console.error(err);
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client);
    });
  });
});

wss.on('connection', function connection(ws, request, client) {
  console.log(chalk.green(`Client ${client} connected! ✅`));

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from user ${client}`);
    ws.send(msg.toUpperCase())
  });

  ws.on('close', function () {
    console.log(chalk.grey('Client disconnected!'));
  });
});

function authenticate(request, callback) {

  console.log('Authentication attempt from origin: ' + chalk.blue(request.headers.origin));

  sessionParser(request, {}, () => {
    if (request.session.userId) {
      callback(null, request.session.userId);
    } else {
      callback(chalk.red('Unauthorized! ❌'));
    }
  });
  
}

server.listen(8080, '127.0.0.1');