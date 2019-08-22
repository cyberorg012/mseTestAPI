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
// router.post('/', (req, res) => { // create one (body param: title, student id, content)
// 	postMethods.postData(req.body, (error, result) => {
// 		if (error) {
// 			console.log(`${error}`);
// 			return res.status(400).json(error);
// 		} else {
// 			console.log(result);
//             return res.json(result);
// 		}
// 	})
// });
router.post('/', (req, res) => {
	const newid = postMethods.genNewID("gallery");
	const title = req.body.title || '';
	if (!title.length) {
		return res.status(400).json({error: 'Empty title'});
	}
	const student_id = req.body.student_id || '';
	if (!student_id.length) {
		return res.status(400).json({error: 'Empty student id'});
	}
	const content = req.body.content || '';
	if (!content.length) {
		return res.status(400).json({error: 'Empty content'});
	}
	console.log("id: " + newid + ", title: " + title);
	const values = [
		[newid, title, student_id, content],
	];
	db.then(client => {
		const sql = "insert into gallery (id, title, student_id, content) VALUES ?";
		client.query(sql, [values], function (error, result) {
			if (!error) {
				console.log("Number of records inserted: " + result.affectedRows);
				return res.send({ message: "POST success", id: values[0][0], title: values[0][1]});
			} else {
				return res.status(400).json({ error: "Query Error"});
			}
		})
	});
})
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