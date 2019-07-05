const express = require('express');
const app = express();
const db = require('./config');

app.listen(3001, () => {
	console.log('Example app listening on port 3001!');
});

app.get('/welcome', (req, res) => { // root page
	res.send('Welcome to MSE Testing API!\n');
});
app.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from user", (err, rows) => {
			if (!err) {
				// console.log(rows);
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})

module.exports = app;