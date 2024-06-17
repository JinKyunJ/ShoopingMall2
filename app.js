const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const mainRouter = require('./routes');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const likeRouter = require('./routes/likeRouter');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const local = require('./strategy/loginStrategy');
const jwtlocal = require('./strategy/jwtStrategy');
const loginRouter = require('./routes/loginRouter');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
// dotenv
const app = express();
dotenv.config();

// 모든 도메인에서 cors 허용
app.use(cors());

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
.then( res => console.log(`mongoDB ${process.env.MONGO_DBNAME} collection connected`))
.catch( err => console.log(err));
mongoose.connection.on('err', (err) => {
    console.log("mongoDB err");
});

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/likes', likeRouter);
app.use('/login', loginRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} port connected`);
});