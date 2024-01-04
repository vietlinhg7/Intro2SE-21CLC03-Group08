const controller = {};
const mongoose = require('mongoose');
//const User = require('../models/user');


controller.showIndex = async (req, res) => {

        res.render('login', {
            layout: 'login-signup',
        });

};

module.exports = controller;
