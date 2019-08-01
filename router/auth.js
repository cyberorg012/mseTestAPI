const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// router.use(bodyParser.urlencoded({ extended: true }));
const db = require('../database/config');
let User = require('../model/user');

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
    // try {
    //     const { id, password, username } = req.body;
    //     const admin = 0;
    //     const created_at = new Date();
    //     if (typeof id !== 'string') {
    //         throw new Error('ID must be a string.');
    //     }
    //     if (typeof password !== 'string') {
    //         throw new Error('Password must be a string.');
    //     }
    //     if (typeof username !== 'string') {
    //         throw new Error('Username must be a string.');
    //     }
    //     console.log("id: " + id + ", username: " + username + ", created_at: " + created_at);
    //     const newUser = {
    //         id: id,
    //         password: password,
    //         username: username,
    //         admin: admin,
    //         created_at: created_at
    //     }
    //     let returnjson = User.createUser(newUser);
    //     return res.status(returnjson.number).json({message: returnjson.message});
    // } catch (err) {
    //     return res.status(400).json({error: [
    //         {
    //           title: 'Registration Error',
    //           detail: 'Something went wrong during registration process.',
    //           errorMessage: err.message,
    //         },
    //       ]
    //     });
    // }

    let sql = "INSERT INTO user (id, password, admin, username, created_at, password_salt) VALUES ?";

    // db.then(client => {
    //     client.query("SELECT TOP 1 * FROM user WHERE id = " + id, (err, rows) => {
    //         if (rows) {
    //             console.log("ID already exists");
    //             return res.status(409).json({error: 'ID already exists'});
    //         }
    //     })
    // })

    bcrypt.genSalt(10, function(err, salt) { // bcrypt generates SALT
        if (err) {
            console.log(err);
            return res.status(501).json({error: "Salt generation failed"});
        }
        console.log("salt: " + salt);
        bcrypt.hash(password, salt, function(err, hash){ // bcrypt HASHes password with salt
            if(err) {
                console.log(err);
                return res.status(501).json({error: "Password Hashing failed"});
            } else {
                let value = [[id, hash, admin, username, created_at, salt]];
                console.log(value);
                db.then(client => {
                    client.query(sql, [value], function(err, result) {
                        if(err) throw err;
                        console.log("Successfully signed up");
                        console.log("Number of records inserted: " + result.affectedRows);
                    })
                });
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