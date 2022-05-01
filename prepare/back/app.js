const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Wellcome, API Factory !!');
});

app.listen(3065, () => {
  console.log('app listening on port 3065');
});
