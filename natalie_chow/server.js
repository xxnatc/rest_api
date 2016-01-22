const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/salem_dev');

const townsRouter = require(__dirname + '/routes/towns_router');
const mafiasRouter = require(__dirname + '/routes/mafias_router');
const actionsRouter = require(__dirname + '/routes/actions_router');

app.use('/api', townsRouter);
app.use('/api', mafiasRouter);

app.use(actionsRouter);

module.exports = exports = app.listen(3000, () => {
  console.log('server up on port 3000');
});
