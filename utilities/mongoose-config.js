
require("dotenv").config();

const env = process.env;

module.exports = {
    string: `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@cluster0-baim8.gcp.mongodb.net/${env.DB}?retryWrites=true`,
    constructor: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
};