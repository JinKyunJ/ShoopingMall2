const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const mainRouter = require('./routes');
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter');
const cashRouter = require('./routes/cashRouter');
const likeRouter = require('./routes/likeRouter');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const local = require('./strategy/loginStrategy');
const jwtlocal = require('./strategy/jwtStrategy');
const loginRouter = require('./routes/loginRouter');

// dotenv
const app = express();
dotenv.config();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('publics'));
// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// passport initialize
app.use(passport.initialize());
passport.use(local);
passport.use(jwtlocal);
app.use(jwtMiddleware);

// mongoose connect
mongoose.connect(process.env.MONGO_URI,{
    dbName: process.env.MONGO_DBNAME
})
.then( res => console.log("mongoDB eliceShopping collection connected"))
.catch( err => console.log(err));
mongoose.connection.on('err', (err) => {
    console.log("mongoDB err");
});

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);
app.use('/cashes', cashRouter);
app.use('/likes', likeRouter);
app.use('/login', loginRouter);

app.use((err,req,res,next) => {
    console.log("내부 error 발생 : " + err);
    res.status(400).json(err.message);
});

app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} port connected`);
});