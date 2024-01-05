const express = require('express');
const router = express.Router();
const controller = require('../controller/Controller');
 
router.get('/',controller.isLoggedIn, controller.showIndex);
router.get('/register', controller.showRegister);

router.get('/login', controller.showLogin);
router.get('/admin', controller.showAdmin);

router.get('/logout', controller.logout);
router.get('/productdetail', controller.isLoggedIn, controller.productdetail);
router.get('/addtoCart', controller.isLoggedIn, controller.addToCart);

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/deleteInCart', controller.isLoggedIn, controller.deleteInCart);
module.exports = router;
