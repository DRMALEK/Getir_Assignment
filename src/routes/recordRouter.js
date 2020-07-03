const express = require('express');
const mongoose = require('mongoose'); // MongoDB ODM
const { body, validationResult } = require('express-validator');
const recordRouter = express.Router();

const CONNECTION_STRING = process.env.CONNECTION_STRING

function router() {
    recordRouter.route('/')
        .post([
            body('startDate').isDate(),
            body('endDate').isDate(),
            body('maxCount').isInt(),
            body('minCount').isInt(),
        ], (req, res) => {
            // Check for errors in the json payload
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ 
                    "code" : -1,
                    "msg": errors.array()}).send();
            }

            (async function query() {
                const startDate = req.body.startDate;
                const endDate = req.body.endDate;
                const minCount = req.body.minCount;
                const maxCount = req.body.maxCount;

                // Do the query
                const connection = await mongoose.createConnection(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).catch(reason => {
                    res.status(500).json({
                        "code": -1,
                        "msg": "Error while performing the database query to get the requested record or records",
                    })
                });
                
                const recordsCol = connection.db.collection('records');

                recordsCol.aggregate([
                    {
                        "$match": {
                            "createdAt": {
                                "$gte": new Date(startDate + "T00:00:00.000Z"), // after the start date
                                "$lt": new Date(endDate + "T00:00:00.000Z") // before the end date
                            }
                        }
                    },
                    { "$unwind": "$counts" },
                    {
                        "$group": {
                            "_id": "$_id",
                            "count": { "$sum": "$counts" },
                            "key": { "$first": "$key" },
                            "createdAt": { "$first": "$createdAt" },
                        }
                    },
                    {
                        "$match": {
                            "count": {
                                "$gte": minCount, // larger than the min count
                                "$lt": maxCount  // smaller than the max count
                            }
                        }
                    },
                    {
                        "$project": {
                            "totalCount": "$count",
                            "key": 1,
                            "createdAt": 1,
                            "_id": 0
                        }
                    }
                ]).toArray((err, docs) => {
                    // Return the results
                    if (err) {
                        res.status(500).json({
                            "code": -1,
                            "msg": "Error while performing the database query to get the requested record or records",
                        })
                    }
                    else {
                        if (docs.length != 0) {
                            res.status(200).json({
                                "code": 0,
                                "msg": "Success",
                                "records": docs
                            })
                        }
                        else {
                            res.status(404).json({
                                "code": -1,
                                "msg": "The requested record or records was not found!"
                            })
                        }

                    }
                })
            }())
        });

    return recordRouter;
}

module.exports = router;