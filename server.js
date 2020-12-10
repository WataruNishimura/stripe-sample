const express = require('express');
const app = express();
//const path = require('path');

app.use(express.static('.'));

app.listen(8080, () => {
  console.log('Running at Port 8080');
});
