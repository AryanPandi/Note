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


mongoose.connect(process.env.DB_URI)
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

app.post('/forgetpassword', async(req,res)=>{
    const {email}= req.body;
    const user= await NoteUser.findOne({email});
    if (!user) {
        return res.status(400).json({ error: `User doesn't exsist.`, success: false });
    }
    try{
        console.log("Inside forget "+email);
        const secret= process.env.TOKEN_SECRET+user.password;
        const token= jwt.sign({email:user.email,_id:user._id},secret,{expiresIn:'5m'});
        const link=`http://localhost:3001/reset-password/${user._id}/${token}`;
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASS,
            },
            tls: {
                rejectUnauthorized: false, // This allows self-signed certificates
            },
        });
          
          var mailOptions = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Sending Email using Node.js for password reset.',
            text: 'Please fine your link for rest password '+link,
          };
          
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Failed to send email" }); // Send error response and return early
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: "Email sent successfully" }); // Send success response
            }
        });
    }catch(e){
        console.log(e);
        res.status(500).json({ error: 'An error occurred during registration',success:false });
    }
});

app.get('/reset-password/:id/:token',async(req,res)=>{
    const {id,token}= req.params;
    const oldUser= await NoteUser.findOne({_id:id});
    if (!oldUser) {
        return res.status(400).json({ error: `User doesn't exsist.`, success: false });
    }
    const secret= process.env.TOKEN_SECRET+oldUser.password;
    try{
        const verify= jwt.verify(token,secret);
        res.render("index",{email: verify.email,status:"notverified"});
    }catch(e){
        res.send("Not Verified");
    }
});
 

app.post('/reset-password/:id/:token',async(req,res)=>{
    const {id,token}= req.params;
    const {password,confirmPassword} = req.body;
    const oldUser= await NoteUser.findOne({_id:id});
    if (!oldUser) {
        return res.status(400).json({ error: `User doesn't exsist.`, success: false });
    }
    const secret= process.env.TOKEN_SECRET+oldUser.password;
    try{
        const verify= jwt.verify(token,secret);
        const salt= await bcrypt.genSalt(10);
        const encryptpassword= await bcrypt.hash(password,salt);
        const updatedUser= await NoteUser.findByIdAndUpdate({_id:id},{$set:{password:encryptpassword}});
        // res.json({ message: "Password updated successfully.", user: updatedUser });
        res.render("index",{email: verify.email,status:"verified"});
    }catch(e){
        return res.status(401).json({ error: 'Token is invalid or has expired.' });
    }
});
 

app.get('/check-auth', (req, res) => {
    const token = req.cookies.token; // Access the token from the cookie
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ isAuthenticated: false });
      }
      res.json({ isAuthenticated: true });
    });
  });

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user = await NoteUser.findOne({email});
    if (!user) {
        return res.status(400).json({ error: 'Email or Password is wrong.', success: false });
    }
    try{
        const match= await bcrypt.compare(password,user.password);
        const token=jwt.sign({ _id: user._id },process.env.TOKEN_SECRET,{expiresIn:'10hr'});
        if(match){
            res.cookie('token',token,{
                httpOnly:true,
                secure:false,
                maxAge:3600000000000
            });
            user.password=undefined;
            res.status(200).json({message:'Successfully Logged Inn.',success:true, user:user });
        }
        else{
            res.status(400).json({error: 'Email or Password is wrong.',success:false});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'An error occurred during registration',success:false });
    };
    
});

app.post('/register',async(req,res)=>{
    const {username,email,password}= req.body;
    try{
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        const newUser= new NoteUser({
            username:username,
            password:hashedPassword,
            email:email,
        });
        const savedUser= await newUser.save();
        res.status(200).json({ message: 'Successfully Registered',success:true });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'An error occurred during registration',success:false });
    }
});

app.get('/getNote', async (req, res) => {
    const user= req.query.currUser;
    const allNotes = await NoteApp.find({user:user._id});

    res.json(allNotes);
});

app.post('/addNote',async(req,res)=>{
    const newNote= new NoteApp({
        title:req.body.title,
        content:req.body.content,
        user:req.body.currUser
    });

    res.json(await newNote.save());
});

app.put('/updateNote/:id',async(req,res)=>{
    const {selectNote,currUser}=req.body;
    const findNoteAndUpdate= await NoteApp.findByIdAndUpdate({_id:req.params.id,user:currUser._id},selectNote,{new:true});

    res.json(findNoteAndUpdate);
});

app.delete('/deleteNote/:id',async(req,res)=>{
    const {currUser}=req.body; 
    const deleteNote= await NoteApp.findByIdAndDelete({_id:req.params.id,user:currUser._id});
    res.json(deleteNote);
});




app.listen(PORT,()=>{
    console.log(`Running on PORT: ${PORT}`);
})
