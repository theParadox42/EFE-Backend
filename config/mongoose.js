// Configures mongoose
module.exports = {
    string: process.env.MONGO_CONNECTION,
    constructor: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
};