const express = require('express');
const router = express.Router();
const db = require('../database/config');
const userMethods = require('../modules/user');
const postMethods = require('../modules/post');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from schedule", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})
router.get('/:id', (req, res) => {
	const id = req.params.id;
	postMethods.fetchDataWithID("schedule", id, (error, result) => {
		if (error) {
			console.log(`${error}`);
			return res.send({error: "Retrieve Error"});
		} else {
			console.log(result.text);
			const row = result.text[0];
			return res.json(row);
		}
	})
})

module.exports.schedule = router;