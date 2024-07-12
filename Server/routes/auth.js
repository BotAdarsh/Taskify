const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "any secret key is fine";

const transporter = nodemailer.createTransport({
    service: 'xxxx',//choose your service provider
    auth: {
        user: 'xxxxxx@xxxx.xxx',//Enter the user ID
        pass: 'xxxx xxxx xxxx',//Enter the Password
    },
});

//Route 1 : Create a user using POST "/api/auth/CreateUser". Doesn`t require login
router.post('/CreateUser', [
    body('Name', 'Enter a valid name').isLength({ min: 3 }),
    body('Email', 'Enter proper email').isEmail(),
    body('Password', 'Password must be of atleat 5 character').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // {else
    // {
    //     const user = User(req.body);
    //     user.save();
    // }
    // res.send(req.body);//My method}

    // {User.create({
    //     Name: req.body.Name,
    //     Email: req.body.Email,
    //     Gender: req.body.Gender,
    //     DOB: req.body.DOB,
    //     Password: req.body.Password,
    // }).then(user => res.send('User data saved successfully !! Thank you'))
    // .catch(err =>{console.log(err)
    // res.json({error:'this email is already taken please use other ',message:err.message})});//diiferent method}
    // async awiat ke saat then ko use karnae ki zarurat nhi hai kyuki ek to ye method modern hai then bhi code jo synchronous banata hai

    //efficient method
    // Check wether the user with this email already exists
    try {
        let user = await User.findOne({ Email: req.body.Email });
        if (user) {
            return res.status(400).json({ error: "This email is already taken plz use other email id" })
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.Password, salt);

        user = await User.create({
            Name: req.body.Name,
            Email: req.body.Email,
            Gender: req.body.Gender,
            DOB: req.body.DOB,
            Password: secpass,
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        const verificationLink = `localhost:5000/api/auth/verify?token=${authtoken}`;
        console.log(authtoken);

        const mailOptions = {
            from: 'xxxxxxxxxxxxxxxxxxxxxx',//Enter the sender id
            to: req.body.Email,
            subject: 'Welcome to NoteWave',
            text: `Thank you for using our service . Please click on link for verification : ${verificationLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Email could not be sent' });
            }
            else {
                console.log('Email sent: ' + info.response);
                return res.json({ "status": "Verification email sent" });
            }
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Some internal error occured");
    }
});


//Route 2: Verification of the user using post "./api/auth/verify" .login not reqiured
router.post('/verify', async (req, res) => {
    const authtoken = req.query.token;  
    try {
        const decoded = jwt.verify(authtoken, JWT_SECRET);//already synchronised method hai isiliye wait likhne ki zarurat nhi hai
        const userid = decoded.user.id;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        if (user.IsVerified) {
            return res.json({ "message": "Email is already verified" });}

        user.IsVerified = true;
        await user.save();
        console.log(user);
        res.json({ "message": "Email verification succesful" })
    } catch (error) {
        console.log(error);
        res.status(500).send("Some internal error occured");
    }
});

//Route 3: login of already verified user "/api/auth/Login" . login page
router.post('/Login', [
    body('Email', 'Enter a proper email ').isEmail(),
    body('Password', 'Enter proper validated password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ Email: req.body.Email })
        console.log(user);
        if (!user) {
            return res.status(400).json({ error: "Please try to login with valid credentials" });
        }
        console.log(user.Password);
        const passwordcompare = await bcrypt.compare(req.body.Password, user.Password);
        if (!passwordcompare) {
            return res.status(400).json({ error: "Please try to login with valid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        console.log(user);
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json(authtoken);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some internal error occured");
    }
});

//Route 4: fetching data of the user "/api/auth/getUser" . Login required 
router.post('/getUser',fetchUser, async (req, res) => {
    try {
        // fetchuser is a middle ware to get user using authtoken
        const userID = req.user.id;
        const user = await User.findById(userID).select("-Password");
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some internal error occured");
    }
})
module.exports = router