const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const NoteApp = require('./model/noteModel');
const NoteUser=require('./model/noteUser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT|| 3000;

mongoose.connect(process.env.DB_URI)
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user = await NoteApp.findOne({ email:email });
    try{
        const match= await bcrypt.compare(password,user.password);
        const token=jwt.sign(JSON.stringify(user),process.env.TOKEN_SECRET);
        if(match){
            res.cookie.token=token;
            res.status(200).send('Successful Login');
        }
        else{
            res.status(401).send('Unsuccessful Login');
        }

    }catch(err){
        console.log(e);
    };
    
});

app.post('/register',async(req,res)=>{
    const {username,email,password}= req.body;
    try{
        const hashedPassword= await bcrypt.hash(password,10);
        const newUser= new NoteUser({
            username:username,
            password:hashedPassword,
            email:email,
        });
        const savedUser= await newUser.save();
        res.status(201).json({ message: 'Successfully Registered' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

app.get('/getNote', async (req, res) => {
    const allNotes = await NoteApp.find();
    res.json(allNotes);
});

app.post('/addNote',async(req,res)=>{
    const newNote= new NoteApp({
        title:req.body.title,
        content:req.body.content
    });
    res.json(await newNote.save());
});

app.put('/updateNote/:id',async(req,res)=>{
    const findNoteAndUpdate= await NoteApp.findByIdAndUpdate({_id:req.params.id},req.body,{new:true});

    res.json(findNoteAndUpdate);
});

app.delete('/deleteNote/:id',async(req,res)=>{
    const deleteNote= await NoteApp.findByIdAndDelete(req.params.id);
    res.json(deleteNote);
});





app.listen(PORT,()=>{
    console.log(`Running on PORT: ${PORT}`);
})