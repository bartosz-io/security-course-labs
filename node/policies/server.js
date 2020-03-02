const path = require('path');
const csp = require('helmet-csp');
const express = require('express');
const app = express();

{
  app.use(csp({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "http://127.0.0.1:8081"],
      imgSrc: ["data:", "http://127.0.0.1:8081"],
      scriptSrc: ["http://127.0.0.1:8081",
        "'nonce-uasdimAsNXCzP5AG6Rvu'"
      ],
      reportUri: "/report-violation"
    }
  }));
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/style.css'));
});

app.get('/api', function (req, res) {
  console.log('API was called!');
  res.status(200).json({ msg: 'Success!' });
});

app.listen(8080);