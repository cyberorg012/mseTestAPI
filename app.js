const express = require('express');
const path = require('path')
const app = express();
const db = require('./database/config');
const cors = require('cors');
require('dotenv').config()

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
}

// setting middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions));
app.use('/img', express.static(path.join(__dirname, '/uploads')))

// router
app.use('/api/user', require('./router/user').user);
app.use('/api/board', require('./router/board').board);
app.use('/api/board_comment', require('./router/board_comment').board_comment);
app.use('/api/gallery', require('./router/gallery').gallery);
app.use('/api/gallery_comment', require('./router/gallery_comment').gallery_comment);
app.use('/api/schedule', require('./router/schedule').schedule);
app.use('/api/auth', require('./router/auth').auth);

//
app.listen(8080, () => {
	console.log('Your API Listening on Port 8080!');
});
app.get('/api/welcome', (req, res) => {
	res.send('Welcome to MSE Testing API!\n');
});

module.exports = app;