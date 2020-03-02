const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

{
  app.use(cors({ origin: 'http://127.0.0.1:8080' }));
}

app.use(express.static(path.join(__dirname, '/public')));

app.get('/api', function(req, res) {
  console.log('External API was called!');
  res.status(200).json({msg: 'Successfully called external API!'});
});

app.listen(8081);