const app = require('./server.js');
const mongoose = require('mongoose'); // MongoDB ODM

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`listening on port on ${port}`);
});
// close the server and close the database connection on SIGINT signal
process.on('SIGINT', () => {
    console.info('SIGINT signal received.');

    // Stops the server from accepting new connections and finishes existing connections.
    server.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1)
          }

    // close your database connection and exit with success (0 code)
    mongoose.connection.close(function () {
        console.log('Mongoose connection disconnected')
        process.exit(0)
      })

})
});