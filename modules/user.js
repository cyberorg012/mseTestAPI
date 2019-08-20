const db = require('../database/config');
const bcrypt = require('bcrypt');
const async = require('async');

const userMethods = {

    createUser: ((newUser, cb) => {
        async.waterfall([

            // managing password hashing
            async.apply(((newUser, callback) => {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.log(err);
                        cb(err, null);
                    } else {
                        console.log("salt: " + salt);
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err);
                                cb(err, null);
                            } else {
                                let value = [[newUser.id, hash, newUser.admin, newUser.username, newUser.created_at, salt]];
                                callback(null, value);
                            }
                        })
                    }
                })
            }), newUser),

            // actual db querying
            ((value) => {
                let sql = "INSERT INTO user (id, password, admin, username, created_at, password_salt) VALUES ?";
                db.then(client => {
                    client.query(sql, [value], function(err, result) {
                        if(err) {
                            cb(err, null);
                        } else {
                            console.log("Successfully signed up");
                            console.log("Number of records inserted: " + result.affectedRows);
                            cb(null, {message: "success"});
                        }
                    })
                });
            })
        ])
    }),

    // ORIGINAL CODE --->

    // let sql = "INSERT INTO user (id, password, admin, username, created_at, password_salt) VALUES ?";
    // bcrypt.genSalt(10, function(err, salt) { // bcrypt generates SALT
    //     if (err) {
    //         console.log(err);
    //         return res.status(501).json({error: "Salt generation failed"});
    //     }
    //     console.log("salt: " + salt);
    //     bcrypt.hash(password, salt, function(err, hash){ // bcrypt HASHes password with salt
    //         if(err) {
    //             console.log(err);
    //             return res.status(501).json({error: "Password Hashing failed"});
    //         } else {
    //             let value = [[id, hash, admin, username, created_at, salt]];
    //             console.log(value);
    //             db.then(client => {
    //                 client.query(sql, [value], function(err, result) {
    //                     if(err) throw err;
    //                     console.log("Successfully signed up");
    //                     console.log("Number of records inserted: " + result.affectedRows);
    //                 })
    //             });
    //         }
    //     });
    // })
}

module.exports = userMethods