const db = require('../database/config');
const async = require('async');

const dbMethods = {

    fetchDataWithID: ((id, cb) => {
        async.waterfall([

            // main query function
            async.apply(((id, callback) => {
                console.log("Now passing mainQueryFunction method");
                db.then(client => {
                    const query_main = "select * from gallery where id = ? limit 1";
                    client.query(query_main, [id], (err, row) => {
                        if (err) {
                            console.log(err);
                            cb(err, null);
                        } else if (row.length == 0) {
                            console.log("No results: " + Error("failure"));
                            cb(Error("failure"), null);
                        } else {
                            console.log({message: "successful", text: row[0]});
                            callback(null, row[0]);
                            cb(null, {message: "successful", text: row})
                        }
                    });
                })
            }), id),

            // hits query function
            ((data, callback) => {
                console.log("Now passing hitsQueryFunction method");
                console.log(data.hits);
                db.then(client => {
                    const query_hit = "update gallery set hits = ? where id = ?";
                    client.query(query_hit, [++data.hits, data.id], (err, row) => {
                        if (err) {
                            console.log(err);
                        } else if (row.length == 0) {
                            console.log("No results: " + err);
                        } else {
                            callback(null, "done");
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