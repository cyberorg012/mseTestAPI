const express = require('express');
const app = express();
const db = require('./database/config');

app.use('/api/user', require('./router/user').user);

app.listen(3000, () => {
	console.log('Your API Listening on Port 3000!');
});

app.get('/api/welcome', (req, res) => { // root page
	res.send('Welcome to MSE Testing API!\n');
});

module.exports = app;