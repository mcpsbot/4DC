const mongoose = require('mongoose');
const path = require('path');

module.exports = async () => {
    await mongoose.connect(process.env.DB_PATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).catch(err => console.error(`${path.basename(__filename)} There was a problem connecting to the database: `, err));
    return mongoose;
}