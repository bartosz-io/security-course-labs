const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const csp = require('helmet-csp');
const app = express();

app.use(cookieSession({
  name: 'session',
  httpOnly: false,
  keys: ['key1', 'key2']
}));
app.use(csp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:'],
    imgSrc: ["'self'", 'data:'],
    reportUri: '/report-violation',
  }
}));
app.use(cors({ origin: 'http://127.0.0.1:8080' }));
app.use(express.static('../angular/dist/xss/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRODUCTS = [
  { value: '<p>Product 1</p>' },
  {
    value: `
      <h2 style="background: lightgray; margin: 0; padding: 5px;"><b>Product 2</b></h2>
      <div style="background: lightblue">Description</div>
      <svg width="200" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
        <rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
      </svg>
    `
  },
  {
    value: `
      Hello World!
    `
  }
];

app.get('/products', (req, res) => {
  req.session.someValue = '12345';
  res.status(200).json(PRODUCTS);
});

app.post('/products', (req, res) => {
  const product = req.body;
  PRODUCTS.push(product);
  res.sendStatus(204);
});

app.post('/report-violation', bodyParser.json({ type: 'application/csp-report' }),
  (req, res) => {
    console.log("=== CONTENT SECURITY VIOLATION ===");
    console.log(req.body);
    res.sendStatus(200);
  });

app.listen(8080);