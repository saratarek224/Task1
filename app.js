require('./mongoConfig');

const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const statusRouter = require('./routes/statusRouter');
app.use(express.urlencoded());

app.use(express.json());
app.use('/', userRouter);
app.use('/status', statusRouter);


app.listen(5005, () => {
    console.log("started");
})