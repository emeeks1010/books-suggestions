const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/');

app.listen(3000, () => console.log('Books app listening on port 3000!'));
