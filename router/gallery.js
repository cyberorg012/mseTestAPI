const express = require('express');
const router = express.Router();
const db = require('../database/config');
const dbMethods = require('../modules/database');

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
router.post('/', (req, res) => { // create one (body param: title, student id, content)
	db.then(client => {
		client("select * from gallery", (err, rows) => {
			if (!err) {
				console.log("last element id: " + rows[rows.length-1].id);
				newid = rows[rows.length-1].id + 1;

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
				let sql = "insert into gallery (id, title, student_id, content) VALUES ?";
				let values = [
					[newid, title, student_id, content],
				];
				db.then(client => {
					client(sql, [values], function (err, result) {
						if (err) throw err;
						console.log("Number of records inserted: " + result.affectedRows);
					})
				});

				const newGalleryPost = {
					id: newid,
					title: title,
					student_id: student_id,
					content: content
				};
				return res.json(newGalleryPost);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({ error: "Retrieve Error" });
			}
		});
	});
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