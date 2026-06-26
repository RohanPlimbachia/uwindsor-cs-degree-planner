const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { suggestSchedule } = require('../controllers/scheduleController');

router.post('/suggest', auth, suggestSchedule);

module.exports = router;
