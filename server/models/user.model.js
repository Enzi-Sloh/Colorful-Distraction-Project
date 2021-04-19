const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email:{ 
        type: String,
        required: [true,"Email is required"],
        minlength: [5, 'Name must be at least 3 characters long'],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        },
        unique: true,
        uniqueCaseInsensitive: true
    },
    username: { 
        type: String,
        required: [true, "Username is required"],
        minlength: [4, 'Username must be at least 4 characters long'],
        unique: true,
        uniqueCaseInsensitive: true
        },
    password: { 
        type: String,
        required: [true, "Password Required"],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    image: {type: String, default: "https://res.cloudinary.com/galleries/image/upload/v1618768062/elena_yu7yf1.jpg"},
    art: { type: [String] },
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: '{PATH} must be unique'});

UserSchema.virtual('confirmPassword')
.get( () => this._confirmPassword )
.set( value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
    .then(hash => {
        this.password = hash;
        next();
    });
});
module.exports = mongoose.model('User', UserSchema);
