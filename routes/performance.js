var express = require('express');
var router = express.Router();
var perf = require('../controller/performance');

let {isLoggedIn, auth_no_t1, auth_no_t1_t2} = require('../middleware/authenticate');

router.post('/get_overall', isLoggedIn, perf.get_performance_overall);
router.post('/all', perf.get_all_user_performance);

module.exports = router;