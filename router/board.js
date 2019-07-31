const express = require('express');
const router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from board", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})

router.get('/category/:category', (req, res) => { // retrieve rows per category
	const category = req.params.category;
	console.log(category);
	db.then(client => {
		client.query("select * from board where category = ?", [category], (err, rows) => {
			if (err) {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			} else {
				return res.json(rows);
			}
		});
	})
})

module.exports.board = router;