const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const houseRoutes = require('./api/routes/house');


app.use(morgan('dev'));
app.use(bodyParser.json());


app.use('/timetable', houseRoutes);

app.use((error, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;
