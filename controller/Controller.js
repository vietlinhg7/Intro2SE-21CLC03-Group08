const controller = {};
const mongoose = require('mongoose');
const User = require('../models/user');

controller.showLogin = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : '/';
    if (req.session.user) {
        return res.redirect(reqUrl);
    }
    res.render('login', {
        layout: 'login-signup',
        reqUrl,
        username: req.signedCookies.username,
        password: req.signedCookies.password,
    });
};

controller.login = async (req, res) => {
    let { account, password, rememberMe } = req.body;
    let user = await User.findOne({ userName: account, password });
    if (user) {
        let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/';
        req.session.user = user;
        if (rememberMe) {
            res.cookie('username', username, {
                maxAge: 60 * 60 * 1000,
                httpOnly: false,
                signed: true,
            });
            res.cookie('password', password, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                signed: true,
            });
        }
        return res.redirect(reqUrl);
    }
    return res.render('login', {
        layout: 'login-signup',
        message: 'Sai tên tài khoản hoặc mật khẩu',
    });
};

controller.logout = (req, res, next) => {
    req.session.destroy(function (error) {
        if (error) return next(error);
        res.redirect('/login');
    });
};

controller.isLoggedIn = async (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        return next();
    }
    else {
        res.redirect('/login');
    }
};

controller.showIndex = async (req, res) => {

        res.render('index', {
            layout: 'index',
        });

};

module.exports = controller;
