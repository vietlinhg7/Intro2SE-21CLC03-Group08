const express = require('express');
const router = express.Router();
const controller = require('../controller/Controller');
 
router.get('/',controller.isLoggedIn, controller.showIndex);
router.get('/register', controller.showRegister);

router.get('/login', controller.showLogin);
router.get('/logout', controller.logout);

router.post('/login', controller.login);
router.post('/deleteInCart',controller.deleteInCart);
module.exports = router;
