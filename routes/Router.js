const express = require('express');
const router = express.Router();
const controller = require('../controller/Controller');
 
router.get('/', controller.showIndex);


module.exports = router;
