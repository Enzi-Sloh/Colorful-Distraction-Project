const UserController = require('../controllers/user.controller');
const {authenticate}  = require('../config/jwt.config');
const multer = require('multer');
const User = require('../models/user.model');
var fs = require('fs');
var path = require('path');


module.exports = app =>{
    app.get('/', UserController.index);
    app.post('/signup', UserController.createUser);
    app.post('/login', UserController.LogIn);
    app.get('/users',  UserController.getAll);
    app.get('/users/:id',  UserController.getUser);
    app.post('/users/:id/image', UserController.updatephoto);
    app.post('/users/:id/art', UserController.updateart);
}
 
  






