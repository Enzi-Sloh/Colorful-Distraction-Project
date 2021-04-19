const User = require('../models/user.model');   
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const {secret} = require("../config/jwt.config")
const { request, response } = require('express');

module.exports = {
    index : (request, response) => {
        response.json({
            message: "Hello World"
        });
    },
    createUser : (req, res) => {
        User.create(req.body)
        .then(user => {
            const userToken = jwt.sign({
                id: user._id
            }, process.env.SECRET_KEY);
            res
                .cookie("usertoken", userToken, secret, {
                    httpOnly: true
                })
                .json({ msg: "success!", user: user });
        })
        .catch(err => res.json(err));
        },
    LogIn : async(req, res) => {
        const user = await User.findOne({ email: req.body.email });
 
    if(user === null) {
        // email not found in users collection
        return res.sendStatus(400);
    }
 
    // if we made it this far, we found a user with this email address
    // let's compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
 
    if(!correctPassword) {
        // password wasn't a match!
        return res.sendStatus(400);
    }
 
    // if we made it this far, the password was correct
    const userToken = jwt.sign({
        id: user._id
    }, process.env.SECRET_KEY);
 
    // note that the response object allows chained calls to cookie and json
    res
        .cookie("usertoken", userToken, secret, {
            httpOnly: true
        })
        .json({ msg: "success!" });
},
logout: (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
},
getAll: (request, response) => {
    User.find({})
        .then(User => response.json(User))
        .catch(err => response.json(err))
},
getUser: (request, response) => {
    User.findOne({_id:request.params.id})
        .then(User => response.json(User))
        .catch(err => response.json(err))
},
updatephoto: (req, res) =>{
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new:true})
    .then(() => res.json('Photo Uploaded'))
    .catch(err => res.status(400).json('Error: ' + err));
},
updateart: (req, res) =>{
    User.findOneAndUpdate({_id: req.params.id}, {$push: req.body}, {new:true})
    .then(() => res.json('Photo Uploaded'))
    .catch(err => res.status(400).json('Error: ' + err));
}
}




