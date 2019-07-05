const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

router.get('/', (req, res) => { // retrieve every rows
	db.then(client => {
		client.query("select * from user", (err, rows) => {
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
router.get('/:id', (req, res) => { // retrieve single row by id
    console.log("id: " + req.params.id);
    const id = parseInt(req.params.id, 10);
	db.then(client => {
		client.query("select id from user where id = " + id, (err, rows) => {
            if (!err) {
                console.log(rows);
                if (rows.length == 0) {
                    return res.status(204).json({message: "No user with the given id"});
                } else {
                    console.log(rows);
                    return res.json(rows);
                }
            } else {
                console.log(`query error : ${err}`);
                return res.status(400).json({error: "Retrieve Error"});
            }
		});
	})
})

module.exports.user = router;