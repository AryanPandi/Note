const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const NoteApp = require('./model/noteModel');
const NoteUser=require('./model/noteUser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const https = require('https');
const noteRoutes= require('./route/noteRoutes');
const userRoutes= require('./route/userRouters');


const agent = new https.Agent({
  rejectUnauthorized: false,
});
const app = express();
app.use(cors({origin:'http://localhost:3000',credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
const PORT=process.env.PORT|| 3000;

require('./DB/conn');


app.use('/n', noteRoutes);
app.use('/u', userRoutes);

app.listen(PORT,()=>{
    console.log(`Running on PORT: ${PORT}`);
})


