const app = require('../../server');
const superTest = require('supertest');
const request = superTest(app);
const mongoose = require('mongoose'); // MongoDB ODM
const _ = require('lodash')

var server;


describe("Test the record endpoint Post functionality", () => {
    afterAll((done) => {
        mongoose.disconnect(done);
    });
    
    it('Requesting an existing record or records by Post', async () => {
        // request body to test
        const requetBody = {
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 2800,
            "maxCount": 2850
        };

        // Expected response body
        const expected = {
            "code": 0,
            "msg": "Success",
            "records": [
                {
                    "key": "NOdGNUDn",
                    "createdAt": "2016-01-28T07:10:33.558Z",
                    "totalCount": 2813
                },
                {
                    "key": "kzSqsBrJ",
                    "createdAt": "2016-12-02T15:07:30.465Z",
                    "totalCount": 2803
                },
                {
                    "key": "xKTZIiIb",
                    "createdAt": "2016-05-18T09:30:12.447Z",
                    "totalCount": 2849
                },
                {
                    "key": "xKTZIiIb",
                    "createdAt": "2016-05-18T09:30:12.447Z",
                    "totalCount": 2849
                }
            ]
        }
        // Send the post request
        const res = await request.post("/record").send(requetBody);
        const toBeTested = JSON.parse(res.text)

        // To compare two arrays of objects by length and values ( order of objects is not important !)
        const recordsTester = (expected, toBeTested) => {
            if (expected.length !== toBeTested.length) return false;
            var isEqual = true;
            _.forEach(expected, (obj1, obj1Index) => {
                var obj1Exist = false;
                _.forEach(toBeTested, (obj2, obj2Index) => {
                    if (_.isEqual(obj1, obj2)) {
                        obj1Exist = true;
                        return;
                    }
                });
                if (!obj1Exist) {
                    isEqual = false;
                    return;
                }
            });
            return isEqual;
        }

        // Check the body of the reponse
        expect(Object.keys(toBeTested).length === Object.keys(expected).length &&
            toBeTested.code === expected.code &&
            toBeTested.msg === expected.msg &&
            recordsTester(expected.records, toBeTested.records)
        ).toBeTruthy()

        // Check the status code
        expect(res.statusCode).toBe(200); 
    })
    
    it("requesting a non-existing record or records by Post", async () => {
        const requestBody = {
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 2810,
            "maxCount": 2812
            }

        const expected = {
            "code": -1,
            "msg": "The requested record or records was not found!"
        }

        // Send the Post reqest
        const res = await request.post("/record").send(requestBody);
        const toBeTested = JSON.parse(res.text)

        // Check the body of the reponse
        expect(Object.keys(toBeTested).length === Object.keys(expected).length &&
                toBeTested.code === expected.code &&
                toBeTested.msg === expected.msg 
            ).toBeTruthy()
    
        // Check the status code
        expect(res.statusCode).toBe(404);
    })
})