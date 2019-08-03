const express = require('express');
const router = express.Router();
const db = require('../database/config');
const dbMethods = require('../modules/database');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from gallery", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.send({error: "Retrieve Error"});
			}
		});
	})
})
router.get('/:id', (req, res) => { // retrieve single row
	const id = req.params.id;
	dbMethods.fetchDataWithID(id, (error, result) => {
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

module.exports.gallery = router;