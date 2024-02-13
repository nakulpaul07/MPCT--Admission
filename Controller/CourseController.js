const CourseModel = require("../model/course")

class CourseController {
    static courseInsert = async (req, res) => {
        try {
            // console.log(req.body)

            const { name, email, phone, dob, address, gender, education, course } = req.body;

            const result = new CourseModel({
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
                user_id: req.userdata._id,

            });
            await result.save();
            res.redirect('/course_display');



        } catch (error) {
            console.log(error)

        }
    }

    static courseDisplay = async (req, res) => {
        try {
            const { name, image, email, } = req.userdata;
            const data = await CourseModel.find({ user_id: req.userdata._id });
            // const data = await CourseModel.findById();
            // console.log(data);
            res.render('course/display', { d: data, n: name, i: image, e: email, msg: req.flash("success") })

        } catch (error) {
            console.log(error)

        }
    }

    static courseview = async (req, res) => {
        try {
            const { name, image } = req.userdata;
            // console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            // console.log(data);
            res.render('course/view', { d: data, n: name, i: image })

        } catch (error) {
            console.log(error)

        }
    }

    static courseEdit = async (req, res) => {
        try {
            const { name, image } = req.userdata;
            // console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            // console.log(data);
            res.render('course/edit', { d: data, n: name, i: image })

        } catch (error) {
            console.log(error)

        }
    }

    static courseDelete = async (req, res) => {
        try {
            await CourseModel.findByIdAndDelete(req.params.id)
            // console.log(data);
            req.flash("success", "Course Deleted Successfully")
            res.redirect("/course_display")

        } catch (error) {
            console.log(error)

        }
    }

    static courseUpdate = async (req, res) => {
        try {
            const { name, email, phone, dob, address, gender, education, course } = req.body;

            await CourseModel.findByIdAndUpdate(req.params.id, {

                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
            });
            // console.log(data);
            req.flash("success", "Updated Successfully")
            res.redirect("/course_display")

        } catch (error) {
            console.log(error)

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

}


module.exports = CourseController;