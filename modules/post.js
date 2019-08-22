const db = require('../database/config');
const async = require('async');

// CURRENTLY AVAILABLE ONLY FOR GALLERY TABLE

const postMethods = {

    fetchDataWithID: ((table_name, id, cb) => { // retrieve single post data from table
        async.waterfall([
            // main query function
            async.apply(((table_name, id, callback) => {
                console.log("Now passing mainQueryFunction method");
                db.then(client => {
                    console.log("Table name: " + table_name + ", id: " + id);
                    const query_main = "select * from " + table_name + " where id = ? limit 1";
                    client.query(query_main, [id], (err, row) => {
                        if (err) {
                            console.log(err);
                            cb(err, null);
                        } else if (row.length == 0) {
                            console.log("No results: " + Error("failure"));
                            cb(Error("failure"), null);
                        } else {
                            console.log({message: "successful", text: row[0]});
                            if (table_name == "schedule") cb(null, {message: "successful", text: row});
                            callback(null, table_name, row[0]);
                            cb(null, {message: "successful", text: row})
                        }
                    });
                })
            }), table_name, id),
            // hits query function (not necessary for schedule table)
            ((table_name, data, callback) => {
                console.log("Now passing hitsQueryFunction method");
                console.log(data.hits);
                db.then(client => {
                    const query_hit = "update " + table_name + " set hits = ? where id = ?";
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

    genNewID: ((table_name) => {
        const sql = "select * from " + table_name;
        db.then(client => {
            client.query(sql, (err, rows) => {
                if (!err) {
                    console.log("last element id: " + rows[rows.length-1].id);
                    newid = rows[rows.length-1].id + 1;
                    return newid;
                } else {
                    return err;
                }
            })
        })
    })

}

module.exports = postMethods;