const express = require('express');

const timeTable = require("../logic/classes");
const router = express.Router();

router.post('/', (req, res, next) => {
    let t = new timeTable(req.body);

    res.status(200).json(t.print());
});

module.exports = router;