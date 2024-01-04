const controller = {};
const mongoose = require('mongoose');
const User = require('../models/user');


controller.showIndex = async (req, res) => {

        res.render('index', {
            layout: 'index',
        });

};

module.exports = controller;
