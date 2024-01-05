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
        state: 'Đăng nhập'
    });
};

controller.login = async (req, res) => {
    let { account, password} = req.body;
    if (account=="" || password==""){
        return res.render('login', {
            layout: 'login-signup',
            message: 'Vui lòng nhập đủ thông tin đăng nhập',
            state: 'Đăng nhập'
        });
    }
    let user = await User.findOne({ userName: account, password });
    let userList = await User.find({});
    let productList = await Product.find({});
    
    if (user) {
        if(user.role=='admin'){
            return res.render('admin', {
                layout: 'login-signup',
                userList : userList,
                productList: productList
            });
        }
        let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/';
        req.session.user = user;
        return res.redirect(reqUrl);
    }
    else {
        return res.render('login', {
            layout: 'login-signup',
            message: 'Sai tên đăng nhập hoặc mật khẩu',
            state: 'Đăng nhập'
        });
            
    }
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
    res.render('index', {
        layout: 'index',
        product: product,
        in_cartproduct: in_cartproduct,
    });

};
controller.showRegister = async (req, res) => {

    res.render('register', {
        layout: 'login-signup',
        state: 'Đăng ký',
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

controller.register = async (req, res) => {
    let { hoten, username, email, sdt, password } = req.body;
    if (hoten=="" || username=="" || email=="" || sdt=="" || password=="") 
    {
        return res.render('register', {
            layout: 'login-signup',
            state: 'Đăng ký',
            errorMessage: "Vui lòng nhập đầy đủ thông tin."
            });
    }
    // Check if the username, email, or sdt has already been used
    let existingUser = await User.findOne({ userName: username },);
    if (existingUser) {
    // One of the username, email, or sdt has already been used
    // Handle this case appropriately, e.g., by sending an error message
        return res.render('register', {
            layout: 'login-signup',
            state: 'Đăng ký',
            errorMessage: "Tên đăng nhập đã được sử dụng rồi."
            });
    }

    let existingEmail = await User.findOne({ email: email },);
    if (existingEmail) {
    // One of the username, email, or sdt has already been used
    // Handle this case appropriately, e.g., by sending an error message
        return res.render('register', {
            layout: 'login-signup',
            state: 'Đăng ký',
            errorMessage: "Email đã được sử dụng rồi."
            });
    }

    // If none of the username, email, or sdt has been used, create a new user
    let newUser = new User({
    hoTen: hoten,
    userName: username,
    email: email,
    sdt: sdt,
    password: password,
    role: 'customer'
    });

    await newUser.save();
    return res.render('register', {
        layout: 'login-signup',
        state: 'Đăng ký',
        errorMessage: "Đăng ký thành công."
        });
};

controller.productdetail = async (req, res) => {
    let product = await Product.findOne({productID: req.query.productID});
    let in_cartproduct = await Product.find({ in_cart: { $gt: 0 } });
    res.locals.product = product;
    return res.render('product_details', {
        layout: 'index',
        in_cartproduct: in_cartproduct,
        });
}
controller.addToCart = async (req, res) => {
    let product = await Product.findOneAndUpdate(
        { productID: req.query.productID }, 
        { $set: { in_cart: req.query.quantity } }, 
        { new: true }
       );

    let in_cartproduct = await Product.find({ in_cart: { $gt: 0 } });
    res.locals.product = product;
    return res.render('product_details', {
        layout: 'index',
        in_cartproduct: in_cartproduct,
        });
}

controller.post = async (req, res) => {
    return res.render('post_product', {
        layout: 'index',
        });
}
module.exports = controller;
