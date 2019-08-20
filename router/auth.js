const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/config');
const userMethods = require('../modules/user');

// create new user (id, password, username fields required)
router.post('/register', (req, res) => {
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

    const newUser = {
        id: id,
        username: username,
        password: password,
        admin: admin,
        created_at: created_at
    };
    userMethods.createUser(newUser, (error, result) => {
        if (error) {
            console.log(`${error}`);
            return res.json(error);
        } else {
            console.log(result);
            return res.json(result);
        }
    })
})

// delete existing user (id, password, username fields required)
router.delete('/deregister', (req, res) => {
    console.log("id: " + req.body.id);
    const id = req.body.id || '';
	if (!id.length) { // if id is not given
		return res.status(400).json({error: 'Empty id'});
    }
    const password = req.body.password || '';
	if (!password.length) { // if password is not given
		return res.status(400).json({error: 'Empty password'});
    }
    const username = req.body.username || '';
	if (!username.length) { // if username is not given
		return res.status(400).json({error: 'Empty username'});
    }
    const dbUser = {
        id: String,
        password: String,
        username: String
    };
    db.then(client => {
        client.query("select * from user where id = " + id, (err, rows) => {
            if (err) {
                console.log(`query error : ${err}`);
                return res.status(400).json({error: "Retrieve Error"});
            } else {
                if (!rows.length) {
                    return res.status(204).json({message: "No user with the given id"});
                } else {
                    dbUser.id = rows[0].id;
                    dbUser.password = rows[0].password;
                    dbUser.username = rows[0].username;
                    console.log(dbUser);
                    bcrypt.compare(password, dbUser.password, (err, res) => {
                        if (err) {
                            console.log(err);
                            return res.status(501).json({error: "Password Comparing Failed"});
                        } else {
                            if (!res) { // if the given password is not matching
                                return res.status(401).json({error: "Wrong Password"});
                            } else {
                                if (username == dbUser.username) {
                                    console.log("User with this id will be deleted: " + dbUser.id);
                                    client.query("delete from user where id = " + dbUser.id, (err, rows) => {
                                        if(err) throw err;
                                        else {
                                            return res.json(rows);
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            }
        })
    })
})

module.exports.auth = router;