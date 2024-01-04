const express = require('express');
const mongoose = require('mongoose');
//const User = require('./models/user');


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

// const addUser = async () => {
//   const newUser = new Billboard({
//     billboardID: 'b01',
//     loaiID: 'l01',
//     kichthuoc: '2.5m x 10m',
//     hinhthuc: 'Cổ động chính trị',
//     hinhanh: 'https://cdnphoto.dantri.com.vn/vdDPWOVB1hcODVeyES8rD1GTLio=/zoom/1200_630/2019/04/23/truong-dh-khoa-hoc-tu-nhien-tphcm-1555986970839.jpg',
//     ngayhethan: new Date('2024-11-21'),
//     locationID: 'p4q5-1'
//   });

//   try {
//     const savedUser = await newUser.save();
//     console.log(`User ${savedUser.userID} has been added.`);
//   } catch (error) {
//     console.error(`Error occurred while adding user: ${error}`);
//   }
// };

// addUser();

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

app.use('/', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});