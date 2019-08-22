const express = require('express');
const router = express.Router();
const db = require('../database/config');
const postMethods = require('../modules/post');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from gallery", (err, results) => {
			if (!err) {
				return res.json(results);
			} else {
				console.log(`query error : ${err}`);
				return res.send({error: "Retrieve Error"});
			}
		});
	})
})
router.get('/:id', (req, res) => { // retrieve single row
	const id = req.params.id;
	postMethods.fetchDataWithID("gallery", id, (error, result) => {
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
router.post('/', (req, res) => { // create one (body param: title, student id, content)
	postMethods.postData(req.body, (error, result) => {
		if (error) {
			console.log(`${error}`);
			return res.status(400).json(error);
		} else {
			console.log(result);
            return res.json(result);
		}
	})
});
router.delete('/:id', (req, res) => { // delete single row
	console.log(req.params.id);
	const id = parseInt(req.params.id, 10);
	db.query("delete from gallery where id = " + id, (err, rows) => {
		if (!err) {
			console.log("post successfully deleted");
			return res.json(rows);
		} else {
			console.log(`query error : ${err}`);
			return res.json(err);
		}
	})
});

module.exports.gallery = router;