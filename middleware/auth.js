const jwt = require('jsonwebtoken');
const UserModel = require('../model/Student')

const checkUserAuth = async (req,res,next) => {
    // console.log("Middelware")
    const {token} = req.cookies;
    // console.log(token);
    if (!token) {
        req.flash("error", "Unauthorized Login")
        res.redirect('/')
    } else {
        const data = jwt.verify(token, "nakulpalqpeisf124kskffl")
        const userdata = await UserModel.findOne({_id:data.ID});
        // console.log(userdata)
        // console.log(data)
        req.userdata = userdata;

        next()
    }
};


module.exports = checkUserAuth