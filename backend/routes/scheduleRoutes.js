const express = require('express');
const router = express.Router();
const { suggestSchedule } = require('../controllers/scheduleController');

router.post('/suggest', suggestSchedule);

module.exports = router;
