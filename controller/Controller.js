const controller = {};
const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');


controller.showAdmin = async (req, res) => {
    let product = await Product.find({});
    let in_cartproduct = await Product.find({ in_cart: 1 });
    res.render('admin', {
        layout: 'index',
        product: product,
        in_cartproduct: in_cartproduct,
    });

};

controller.deleteUser = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        await User.deleteOne({ userName: keyword });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

controller.addUser = async (req, res) => {
    const newUser = new User({
        userName: "admin",
        password: "admin",
        hoTen: "admin",
        email: "admin",
        sdt: "01234567764",
        role: "user",
    });

    try {
        const savedUser = await newUser.save();
        console.log(`User ${savedUser.userID} has been added.`);
    } catch (error) {
        console.error(`Error occurred while adding user: ${error}`);
    }
};

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
    let admin = await User.findOne({ userName: "admin", password : "admin" });
    let userList = await User.find({});
    let productList = await Product.find({});
    if(admin){
        return res.render('admin', {
            layout: 'login-signup',
            userList : userList,
            productList: productList
        });
    }
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
    let product = await Product.find({});
    let in_cartproduct = await Product.find({ in_cart: 1 });
    res.render('product_details', {
        layout: 'index',
        product: product,
        in_cartproduct: in_cartproduct,
    });

};
controller.showRegister = async (req, res) => {

    res.render('register', {
        layout: 'login-signup',
    });

};

controller.deleteInCart = async (req, res) => {
    const keyword = req.query.keyword;
    await Product.updateOne({ productName: keyword, in_cart: 1 }, { in_cart: 0 });
    try {
        
        res.redirect('/');
        // or wherever you want to redirect after saving
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = controller;
