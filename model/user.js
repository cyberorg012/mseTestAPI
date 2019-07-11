const db = require('../database/config');
const bcrypt = require('bcrypt');

let User = {
    id: String,
    password: String,
    username: String,
    admin: Number,
    created_at: Date
}

User.createUser = ((newUser) => {
    let sql = "INSERT INTO user (id, password, admin, username, created_at, password_salt) VALUES ?";
    bcrypt.genSalt(10, function(err, salt) { // bcrypt generates SALT
        if (err) {
            console.log(err);
            // return res.status(501).json({error: "Salt generation failed"});
            return json({number: 501, error: "Salt generation failed"});
        }
        console.log("salt: " + salt);
        bcrypt.hash(newUser.password, salt, function(err, hash){ // bcrypt HASHes password with salt
            if (err) {
                console.log(err);
                return res.status(501).json({error: "Password Hashing failed"});
            } else {
                let value = [[newUser.id, hash, newUser.admin, newUser.username, newUser.created_at, salt]];
                console.log(value);
                db.then(client => {
                    client.query(sql, [value], function(err, result) {
                        if(err) throw err;
                        else {
                            console.log("Successfully signed up");
                            console.log("Number of records inserted: " + result.affectedRows);
                            // return res.status(201).json(newUser);
                            return {number: 201, message: "Successfully signed up"};
                        }
                    })
                });
            }
        });
    });
})

module.exports = User