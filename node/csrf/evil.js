const path = require('path');
const express = require('express');
const app = express();

app.get('/link', function(req, res) {
  res.sendFile(path.join(__dirname, '/evil-link.html'));
});

app.get('/form', function(req, res) {
  res.sendFile(path.join(__dirname, '/evil-form.html'));
});

app.listen(8081);