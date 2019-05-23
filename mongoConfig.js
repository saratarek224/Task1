const mongoose = require("mongoose");



const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/project';

mongoose.connect(MONGO_URL, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true,
    })
    .then(() => console.log('ok'))
    .catch(() => console.log('not ok'));