const mongoose = require('mongoose');
const crypto = require('crypto');

const DeveloperSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },

});

// Method to set salt and hash the password for a user 
DeveloperSchema.methods.setPassword = function (password) {

    // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 

    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

// Method to check the entered password is correct or not 
DeveloperSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

module.exports = mongoose.model('developers', DeveloperSchema);