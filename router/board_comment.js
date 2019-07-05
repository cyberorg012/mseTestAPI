const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from board_comment", (err, rows) => {
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

module.exports.board_comment = router;