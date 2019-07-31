const express = require('express');
const router = express.Router();
// router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

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
	db.then(client => {
		client.query("select * from gallery where id = " + id + " limit 1", (err, rows) => {
			if (err) {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			} else {
				console.log(rows);
				return res.json(rows[0]); // just a single row out of the result
			}
		})
	})
})

module.exports.gallery = router;