const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Load routes from server.js
app.use(express.json());
require('./server')(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
