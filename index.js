const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();
const PORT = 4000;
const expressHbs = require("express-handlebars");
const session = require('express-session');
const cookieParser = require('cookie-parser');

var authRouter = require('./routes/Router');

// Thiet lap thu muc Static
app.use(express.static(__dirname + "/html"));

//Cau hinh su dung View Template
app.engine(
  "hbs", 
  expressHbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
})
);
app.set("view engine", "hbs");

const uri = "mongodb+srv://nhom10:web21ktpm@cluster0.uveminn.mongodb.net/nhom8?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const addProduct = async () => {
  const newProduct = new Product({
    productName: "Laptop Acer Gaming Predator Helios 300 PH315-54-78W5",

    price_old: "26.000.000đ",
    price_current: "24.999.000đ",
    quality: 60,
    item_sold: 88,
    in_cart: 1,
    image:"https://product.hstatic.net/1000233206/product/acer-predator-helios-300-ph315-52-78hh_b0c44256d1be443bada03b5b2b20252f_master.png",
  });

  try {
    const savedProduct = await newProduct.save();
    console.log(`Product ${savedProduct.productName} has been added.`);
  } catch (error) {
    console.error(`Error occurred while adding user: ${error}`);
  }
};

 //addProduct();

// Cau hinh cho phep doc du lieu gui len bang phuong thuc POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Thiết lập sử dụng cookies
app.use(cookieParser('COOKIE_SECRET'));

// Thiết lập sử dụng session và lưu trữ session trên Redis
app.use(
    session({
        secret: 'SESSION_SECRET',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: true, // prevent client side JS from reading the cookie
            maxAge: 20 * 60 * 1000, // 20m
        },
    })
);

app.use('/', authRouter);``

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});