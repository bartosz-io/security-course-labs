const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

app.use(session({
  secret: 'secret key',
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: 3600000 }
}));
app.use(cors({origin: 'http://127.0.0.1:8080'}));
app.use(express.static('../angular/dist/csrf/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
  const login = req.body.login;
  req.session.loggedUser = login;
  res.sendStatus(204);
});

app.get('/user', (req, res) => {
  res.status(200).json({ user: req.session.loggedUser });
});

app.get('/logout', (req, res) => {
  req.session.loggedUser = undefined;
  res.status(200).json();
});

app.get('/transfer/:receiver/:value', (req, res) => {
  if (!req.session.loggedUser) {
    console.log('Unauthorized GET!');
    res.status(401).json({error: "Unauthorized!"});
  } else {
    const sender = req.session.loggedUser;
    const receiver = req.params.receiver;
    const value = req.params.value;
    console.log(`[GET] Sending ${value}$ to ${receiver} from ${sender}!`);
    res.status(200).json({ message: 'SUCCESS'});
  }
});

app.post('/transfer', (req, res) => {
  if (!req.session.loggedUser) {
    console.log('Unauthorized POST!');
    res.status(401).json({error: "Unauthorized!"});
  } else {
    const sender = req.session.loggedUser;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    console.log(`[POST] Sending ${amount}$ to ${receiver} from ${sender}!`);
    res.status(200).json({ message: 'SUCCESS'});
  }
});

app.listen(80, '127.0.0.1');