const db = require('../database/config');
const async = require('async');

const dbMethods = {
    mainQueryFunction: ((callback) => {
        db.then(client => {
            const query_main = "select * from gallery where id = ? limit 1";
            client.query(query_main, [id], (err, row) => {
                if (err) {
                    // reject(Error("failure"));
                    reject(err);
                } else if (row.length == 0) {
                    reject(Error("No results"));
                } else {
                    resolve({message: "successful", text: row[0]});
                    callback(null, row[0]);
                }
            });
        })
    }),
    hitsQueryFunction: ((data, callback) => {
        db.then(client => {
            const query_hit = "update gallery set hits = ? where id = ?";
            client.query(query_hit, [data.hits, data.id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row.length == 0) {
                    reject(Error("No results"));
                } else {
                    console.log("Now passing Hits Query Function")
                    callback(null, "done");
                }
            })
        })
    }),
    fetchDataWithID: ((id) => {
        return new Promise ((resolve, reject) => {
            db.then(client => {
                const query_main = "select * from gallery where id = ? limit 1";
                client.query(query_main, [id], (err, row) => {
                    if (row.length > 0) {
                        resolve({message: "successful", text: row});
                    }
                    else {
                        // reject(Error("failure"));
                        reject(err);
                    }
                });
            })
        })
        // async.waterfall([
        //     async.apply(this.mainQueryFunction, id),
        //     this.hitsQueryFunction
        // ], (err, result) => {
        //     console.log(result);
        // })
    }),
}

module.exports = dbMethods;