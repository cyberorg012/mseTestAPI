const express = require('express');
const router = express.Router();
const db = require('../database/config');
const dbMethods = require('../database/methods');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from gallery", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})
router.get('/:id', (req, res) => { // retrieve single row
	const id = parseInt(req.params.id, 10);
	// db.then(client => {
	// 	client.query("select * from gallery where id = " + id + " limit 1", (err, rows) => {
	// 		if (err) {
	// 			console.log(`query error : ${err}`);
	// 			return res.status(400).json({error: "Retrieve Error"});
	// 		} else {
	// 			console.log(rows);
	// 			let hits = rows[0].hits + 1;
	// 			console.log(hits);
	// 			client.query("update gallery set hits = " + hits + " where id = " + id, (err, rows) => {
	// 				if (err) return res.json(err);
	// 				else console.log("hits successfully updated to " + hits);
	// 			})
	// 			return res.json(rows[0]); // just a single row out of the result
	// 		}
	// 	})
	// })
	dbMethods.fetchDataWithID(id)
	.then((data) => {
		console.log(data.text);
		const row = data.text[0];
		return res.json(row);
	}, (error) => {
		console.log(`${error}`);
		return res.status(400).json({error: "Retrieve Error"});
	})
})

module.exports.gallery = router;