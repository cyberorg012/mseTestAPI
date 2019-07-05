const express = require('express');
const app = express();
const db = require('./database/config');

app.use('/api/user', require('./router/user').user);
app.use('/api/board', require('./router/board').board);
app.use('/api/board_comment', require('./router/board_comment').board_comment);
app.use('/api/gallery', require('./router/gallery').gallery);
app.use('/api/gallery_comment', require('./router/gallery_comment').gallery_comment);
app.use('/api/schedule', require('./router/schedule').schedule);

app.listen(3000, () => {
	console.log('Your API Listening on Port 3000!');
});

app.get('/api/welcome', (req, res) => { // root page
	res.send('Welcome to MSE Testing API!\n');
});

module.exports = app;