const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const errorHandler=require("./middleWare/errorMiddleware")
const cookieParser = require('cookie-parser');
const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Route Middleware
app.use('/api/users', userRoute);

//Routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

//Error Middleware
app.use(errorHandler);

//connect to mongodb and start server

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
    }
    )
    .catch(err => console.log(err));