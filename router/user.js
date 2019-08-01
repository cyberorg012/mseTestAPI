const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

// retrieve every users
router.get('/', (req, res) => {
	db.then(client => {
		client.query("select id, username from user", (err, rows) => {
			if (!err) {
				return res.json(rows);
			} else {
				console.log(`query error : ${err}`);
				return res.status(400).json({error: "Retrieve Error"});
			}
		});
	})
})

// retrieve single user by id
router.get('/:id', (req, res) => {
    console.log("id: " + req.params.id);
    const id = parseInt(req.params.id, 10);
	db.then(client => {
		client.query("select id, username from user where id = " + id, (err, rows) => {
            if (!err) {
                if (rows.length == 0) {
                    return res.status(204).json({message: "No user with the given id"});
                } else {
                    console.log(rows);
                    return res.json(rows[0]);
                }
            } else {
                console.log(`query error : ${err}`);
                return res.status(400).json({error: "Retrieve Error"});
            }
		});
	})
})

module.exports.user = router;