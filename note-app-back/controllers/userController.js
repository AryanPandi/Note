const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NoteUser = require('../model/noteUser');
const nodemailer = require('nodemailer');


exports.register=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const user = await NoteUser.findOne({ email });
    if (user) {
        return res.status(500).json({ message: 'User already present.', success: false });
    }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        const newUser= new NoteUser({
            username:username,
            password:hashedPassword,
            email:email,
        });
        const savedUser= await newUser.save();
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
            subject: 'Sending Email using Node.js for registeration in Notesapp.',
            text: 'Thank you for your registration in the Notes App.'
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
        res.status(200).json({ message: 'Successfully Registered',success:true });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'An error occurred during registration',success:false });
    }
}

exports.login = async(req,res)=>{
    const { email, password } = req.body;
    const user = await NoteUser.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not present', success: false });
    }
    try {
        const match = await compareHashPassword(password, user.password);
        const payload = {
            username: user.username,
            email: user.email,
            password: user.password,
        };
        const token = genJWTToken(payload);
        if (match) {
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000000000
            });
            user.password = undefined;
            res.status(200).json({ message: 'Successfully Logged Inn.', success: true, user: user });
        }
        else {
            res.status(400).json({ message: 'Email or Password is wrong.', success: false });
        }


    } catch (e) {
        res.status(500).json({ message: 'An error occurred during login', success: false });
    }
}

exports.forgetpassword= async(req,res)=>{
    const { email } = req.body;
    try {
        const user = await NoteUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: `User doesn't exist.`, success: false });
        }

        const secret = process.env.TOKEN_SECRET + user.password;
        const token = jwt.sign({ email: user.email, _id: user._id }, secret, { expiresIn: '5m' });
        const link = `http://localhost:3001/reset-password/${user._id}/${token}`;

        // Setting up nodemailer transport
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
                rejectUnauthorized: false,
            },
        });

        // Mail options for password reset
        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Password Reset for Notes App',
            text: `Please use the following link to reset your password: ${link}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: "Password reset link sent successfully" });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Controller for handling password reset
exports.resetpassword = async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        const oldUser = await NoteUser.findOne({ _id: id });
        if (!oldUser) {
            return res.status(400).json({ error: `User doesn't exist.`, success: false });
        }

        const secret = process.env.TOKEN_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        await NoteUser.findByIdAndUpdate(
            { _id: id },
            { $set: { password: encryptedPassword } }
        );

        res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Token is invalid or has expired.' });
    }
};

// Controller for checking authentication status
exports.checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
        if (err) {
            return res.json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true });
    });
};