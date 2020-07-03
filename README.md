# Getir_Assignment
A RESTful API with a single endpoint that fetches the data from a MongoDB collection and return the results.

# How to use the API:

 * **URL**

   `malek-getir-assignment.herokuapp.com`

* **Method:**
  
   `POST`

* **Data Params**

  ```
    startDate, endDate, minCount, maxCount
  ```
   **Required:**
 
   `startDate=[Date]`
   `endDate=[Date]`
   `minCount=[Integer]`
   `maxCount=[Integer]`
   
* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** 
     ``` 
    {  
       code:[Integer],  // 0
       msg:[String],    // Success
       records:[ Array of {"key":[String], "createdAt":[String],"totalCount":[Integer]}]        // Retrived records or record if any
    }
    ```

* **Error Response:**

  * **Code:** 404 RESOURCE NOT FOUND <br />
    **Content:** 
    ```
    {
     "code": -1,
     "msg": "The requested record or records was not found!"
    }
    
    ```

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:**
      ```
      {
          "code": -1,
          "msg": [
              {
                  "msg": "Invalid value",
                  "param": "maxCount",
                  "location": "body"
              }
          ]
      }
     ```
     
   OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:**
      ```
      {
      "code": -1,
      "msg": "Error while performing the database query to get the requested record or records",
      }
     ```

* **Sample Call:**

  ```
  curl --header "Content-Type: application/json" \ 
       --request POST \
       --data '{"startDate":"2016-01-26","endDate": "2018-02-02","minCount":2700,"maxCount":2710}' \
        https://malek-getir-assignment.herokuapp.com/record
  ```
  Response
  
  ```
  {
    "code": 0,
    "msg": "Success",
    "records": [
        {
            "key": "udZfCkvB",
            "createdAt": "2016-05-15T00:36:34.126Z",
            "totalCount": 2701
        },
        {
            "key": "vZZOIiPi",
            "createdAt": "2016-03-02T09:30:26.664Z",
            "totalCount": 2701
        }
    ]
   }
  
  ```
  
# Running the API localy 

```
git init https://github.com/DRMALEK/Getir_Assignment.git
git clone
npm init
npm run start
```
The API will run on the localhost with port 3000

*Note: Make sure to supply the database connection string via dotenv*

# Running the API localy with nodemon
```
npm run start_dev
```
# Testing the app
```
npm test
```

# Author
@DRMALEK
