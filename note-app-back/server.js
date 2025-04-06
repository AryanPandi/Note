const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const NoteApp = require('./model/noteModel');
// const NoteUser=require('./model/noteUser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
// var nodemailer = require('nodemailer');
const https = require('https');
const noteRoutes= require('./route/noteRoutes');
const userRoutes= require('./route/userRouters');
const adminRoutes= require('./route/adminRoutes');
const { model } = require('mongoose');
const socketIo=require('socket.io');
const { METHODS } = require('http');



// const NoteUser = require("./model/noteUser");


const agent = new https.Agent({
 rejectUnauthorized: false,
});
const app = express();
app.use(cors({origin:['http://localhost:3000','http://localhost:3002'],credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
const PORT=process.env.PORT|| 3000;


require('./DB/conn');



app.use('/n', noteRoutes);
app.use('/u', userRoutes);
app.use('/a',adminRoutes)


const server= app.listen(PORT,()=>{
  console.log(`Running on PORT: ${PORT}`);
})


const io=socketIo(server,{
 cors:{
  origin:['http://localhost:3000','http://localhost:3002'],
  methods:['GET','POST'],
   credentials: true
  },
});


io.on('connection',(socket)=>{
 socket.on('join_room', (userId) => {
  socket.join(userId);
  console.log(`User joined room: ${userId}`);
 });
 socket.on('disconnect',()=>{
  console.log('disconnected!!')
 })
});


app.set('io', io);


// async function updateUsers() {
//  try {
//   // Update all users to have a default role of 'user'
//   const result = await NoteUser.updateMany(
//    { email:process.env.ADMIN_EMAIL}, // Example condition: email ends with '@admin.com'
//     { $set: { role: 'admin' } } // Set role to 'user' for these users
//   );
//   console.log(`Updated ${result.nModified} users to have the default role 'user'`);
//  } catch (error) {
//   console.error('Error updating users:', error);
//  } finally {
//   mongoose.connection.close();
//  }
// }
// updateUsers();


