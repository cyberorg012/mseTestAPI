const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');

// create new user (id, password, username fields required)
router.post('/', (req, res) => {
    const id = req.body.id || '';
    if (!id.length) {
        return res.status(400).json({error: 'Empty id'});
    }
    const password = req.body.password || '';
    if (!password.length) {
        return res.status(400).json({error: 'Empty password'});
    }
    const username = req.body.username || '';
    if (!username.length) {
        return res.status(400).json({error: 'Empty username'});
    }
    const admin = 0;
    const created_at = new Date();
    console.log("id: " + id + ", username: " + username + ", created_at: " + created_at);

    let sql = "INSERT INTO user (id, password, admin, username, created_at, password_salt) VALUES ?";
    bcrypt.genSalt(10, function(err, salt) { // bcrypt generates SALT
        if (err) {
            console.log(err);
            return res.status(501).json({error: "Salt generation failed"});
        }
        console.log("salt: " + salt);
        bcrypt.hash(password, salt, function(err, hash){ // bcrypt HASHes password with salt
            if(!err) {
                let value = [[id, hash, admin, username, created_at, salt]];
                console.log(value);
                db.then(client => {
                    client.query(sql, [value], function(err, result) {
                        if(err) throw err;
                        console.log("Successful");
                        console.log("Number of records inserted: " + result.affectedRows);
                    })
                });
            } else {
                console.log(err);
                return res.status(501).json({error: "Password Hashing failed"});
            }
        });
    })            
    const newUser = {
        id: id,
        username: username,
        created_at: created_at
    };
    return res.status(201).json(newUser);
})

// retrieve every users
router.get('/', (req, res) => {
	db.then(client => {
		client.query("select id, username from user", (err, rows) => {
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