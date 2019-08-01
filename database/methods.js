const db = require('../database/config');
const async = require('async');

const dbMethods = {
    fetchDataWithID: ((id, cb) => {
        // return new Promise ((resolve, reject) => {
        //     console.log("Now passing fetchDataWithID method");
        //     async.waterfall([
        //         async.apply(((id, callback) => {
        //             console.log("Now passing mainQueryFunction method");
        //             db.then(client => {
        //                 const query_main = "select * from gallery where id = ? limit 1";
        //                 client.query(query_main, [id], (err, row) => {
        //                     if (err) {
        //                         console.log(err);
        //                         reject(Error("failure"));
        //                     } else if (row.length == 0) {
        //                         console.log("No results: " + err);
        //                         reject(Error("failure"));
        //                     } else {
        //                         console.log({message: "successful", text: row[0]});
        //                         callback(null, row[0]);
        //                         resolve({message: "successful", text: row});
        //                     }
        //                 });
        //             })
        //         }), id),
        //         ((data, callback) => {
        //             console.log("Now passing hitsQueryFunction method");
        //             console.log(data.hits);
        //             db.then(client => {
        //                 const query_hit = "update gallery set hits = ? where id = ?";
        //                 client.query(query_hit, [++data.hits, data.id], (err, row) => {
        //                     if (err) {
        //                         console.log(err);
        //                         reject(Error("failure"));
        //                     } else if (row.length == 0) {
        //                         console.log("No results: " + err);
        //                         reject(Error("failure"));
        //                     } else {
        //                         callback(null, "done");
        //                         resolve({message: "successful", text: row});
        //                     }
        //                 })
        //             })
        //         }),
        //     ], (err, result) => { // result is currently "done"
        //         console.log(result);
        //     })
        // })
        async.waterfall([
            async.apply(((id, callback) => {
                console.log("Now passing mainQueryFunction method");
                db.then(client => {
                    const query_main = "select * from gallery where id = ? limit 1";
                    client.query(query_main, [id], (err, row) => {
                        if (err) {
                            console.log(err);
                            // reject(Error("failure"));
                            cb(err, null);
                        } else if (row.length == 0) {
                            console.log("No results: " + Error("failure"));
                            // reject(Error("failure"));
                            cb(Error("failure"), null);
                        } else {
                            console.log({message: "successful", text: row[0]});
                            callback(null, row[0]);
                            // resolve({message: "successful", text: row});
                            cb(null, {message: "successful", text: row})
                        }
                    });
                })
            }), id),
            ((data, callback) => {
                console.log("Now passing hitsQueryFunction method");
                console.log(data.hits);
                db.then(client => {
                    const query_hit = "update gallery set hits = ? where id = ?";
                    client.query(query_hit, [++data.hits, data.id], (err, row) => {
                        if (err) {
                            console.log(err);
                            // reject(Error("failure"));
                        } else if (row.length == 0) {
                            console.log("No results: " + err);
                            // reject(Error("failure"));
                        } else {
                            callback(null, "done");
                            // resolve({message: "successful", text: row});
                        }
                    })
                })
            }),
        ], (err, result) => { // result is currently "done"
            console.log(result);
        })
    }),
}

module.exports = dbMethods;