const express = require('express');
const app = express();
let counter = 0;

app.get('/pingpong', (req, res) => {
  counter += 1;
  res.send(`pong ${counter}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping-pong app listening on port ${PORT}`);
});
