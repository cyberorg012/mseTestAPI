const express = require('express');
const router = express.Router();
const db = require('../database/config');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from board_comment", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})

module.exports.board_comment = router;