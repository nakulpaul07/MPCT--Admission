const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: "user",
    },
    image: {
   
        public_id: {
            type: String,
            Required : true,
        },

        url:{
            type: String,
            Required : true,
        },

    },

}, { timestamps: true })

const UserModel = mongoose.model('User', userschema)

module.exports = UserModel