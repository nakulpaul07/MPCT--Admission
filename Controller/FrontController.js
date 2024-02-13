const UserModel = require('../model/Student')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const CourseModel = require('../model/course')

cloudinary.config({
    cloud_name: 'dqqgdxtgx',
    api_key: '661387327716212',
    api_secret: 'aOQnvPghucWnXASKpR6AZu_i93Y'
});

class FrontController {


    static login = async (req, res) => {
        try {
            res.render('login', { msg: req.flash('success'), error: req.flash('error') })

        } catch (error) {
            console.log('error')

        }
    }

    static dashboard = async (req, res) => {
        try {
            const { name, image, email, id } = req.userdata;
            const btech = await CourseModel.findOne({ user_id: id, course: "B.Tech" })
            // console.log(btech)
            //consol.log(name)
            res.render('dashboard', { n: name, i: image, e: email, b: btech })

        } catch (error) {
            console.log('error')

        }
    }

    static register = async (req, res) => {
        try {
            res.render('register', { msg: req.flash('error') })

        } catch (error) {
            console.log('error')

        }
    }

    static about = async (req, res) => {
        try {
            const { name, image } = req.userdata;
            res.render('about', { n: name, i: image })

        } catch (error) {
            console.log('error')

        }
    }

    static contact = async (req, res) => {
        try {
            const { name, image } = req.userdata;
            res.render('contact', { n: name, i: image })

        } catch (error) {
            console.log('error')

        }
    }

    //data insert reg
    static insertReg = async (req, res) => {
        try {
            // console.log(req.files.image)
            const file = req.files.image;
            // image upload
            const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "profile"
            })
            //  console.log(uploadImage);
            // res.render('register');
            // console.log(req.body);
            const { n, e, p, cp } = req.body;
            const user = await UserModel.findOne({ email: e });
            //console.log(user);
            if (user) {
                req.flash("error", "email already exist ");
                res.redirect("/register");
            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: uploadImage.public_id,
                                url: uploadImage.secure_url,
                            },
                        });
                        await result.save();
                        req.flash("success", "Register successfully, Now You Can Login")
                        res.redirect('/');//route url
                    } else {
                        req.flash("error", "password and conform password not same");
                        res.redirect("/register");
                    }
                } else {
                    req.flash("error", "Please Fill All Field");
                    res.redirect("/register");
                }
            }

        } catch (error) {
            console.log(error);
        }
    };

    static vlogin = async (req, res) => {
        try {
            // console.log(req.body)
            const { e, p } = req.body
            if (e && p) {
                const user = await UserModel.findOne({ email: e })

                if (user != null) {
                    const isMatched = await bcrypt.compare(p, user.password)
                    if (isMatched) {
                        if (user.role == "admin") {
                            // token gen.
                            let token = jwt.sign({ ID: user.id }, "nakulpalqpeisf124kskffl")
                            // console.log(token);
                            res.cookie("token", token)


                            res.redirect('/admin/dashboard')
                        } else {
                            // token gen.
                            let token = jwt.sign({ ID: user.id }, "nakulpalqpeisf124kskffl")
                            // console.log(token);
                            res.cookie("token", token)


                            res.redirect('/dashboard')
                        }

                    }
                    else {
                        req.flash("error", "You are not a register User");
                        res.redirect("/");
                    }
                }

                else {
                    req.flash("error", "All Field are required");
                    res.redirect("/");
                }


            }


        } catch (error) {
            console.log('error')

        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token")
            res.redirect('/')

        } catch (error) {
            console.log('error')

        }
    }

    static profile = async (req, res) => {
        try {
            const { name, image, email, } = req.userdata;
            res.render('profile', { n: name, i: image, e: email, })

        } catch (error) {
            console.log('error')

        }
    }

    static updateProfile = async (req, res) => {
        try {
            const { id } = req.userdata
            const { name, email, image } = req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id

                // delete image from cloudnary
                await cloudinary.uploader.destroy(imageID)
                // new image
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: "profileImage"
                })

                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    }
                }
            } else {

                var data = {
                    name: name,
                    email: email,

                }

            }

            await UserModel.findByIdAndUpdate(id, data)
            req.flash("success", "Update Successfully");
            res.redirect("/profile");

        } catch (error) {

        }
    }

    static changepassword = async (req, res) => {
        try {
            const { op, np, cp } = req.body;
            const { id } = req.userdata;
            if (op && np && cp) {
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(op, user.password);
                console.log(isMatched);
                if (!isMatched) {
                    req.flash("error", "current password is incorrect");
                    res.redirect("/profile");
                } else {
                    if (np != cp) {
                        req.flash("error", "password does not match");
                        res.redirect("/profile");
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "password updated successfully");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "all fields are required");
                res.redirect("/profile");
            }
        } catch (error) {
            console.log(error);
        }
    };





};

module.exports = FrontController;