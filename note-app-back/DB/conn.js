const mongoose = require("mongoose");

const HOST = process.env.DB_URI;

// Connect to the database using async/await
(async () => {
    try {
        await mongoose.connect(HOST, {
            dbName: "notes",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        });
        console.log(`Connected to department database --> host : ${HOST}`);
    } catch (error) {
        console.error(error);
    }
})();

const conn = mongoose.connection;

module.exports = conn;
