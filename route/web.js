const express = require('express')
const FrontController = require('../Controller/FrontController')
const route = express.Router()
const checkUserAuth = require("../middleware/auth")
const CourseController = require('../Controller/CourseController')
const AdminController = require('../Controller/admin')

route.get('/', FrontController.login)
route.get('/dashboard', checkUserAuth, FrontController.dashboard)
route.get('/register', FrontController.register)
route.get('/contact', checkUserAuth, FrontController.contact)
route.get('/about', checkUserAuth, FrontController.about)

// post (Form Actions)
route.post('/insertreg', FrontController.insertReg)
route.post('/vlogin', FrontController.vlogin)
route.get('/logout', FrontController.logout)

//COurseController
route.post('/courseInsert', checkUserAuth, CourseController.courseInsert)
route.get('/course_display', checkUserAuth, CourseController.courseDisplay)
route.get('/course_view/:id', checkUserAuth, CourseController.courseview)
route.get('/course_edit/:id', checkUserAuth, CourseController.courseEdit)
route.get('/course_delete/:id', checkUserAuth, CourseController.courseDelete)
route.post('/course_update/:id', checkUserAuth, CourseController.courseUpdate)
route.get('/profile', checkUserAuth, FrontController.profile)
route.post('/updateProfile', checkUserAuth, FrontController.updateProfile)
route.post('/changepassword', checkUserAuth, FrontController.changepassword)

// AdminController
route.get('/admin/dashboard', checkUserAuth, AdminController.dashboard)
route.post('/admin/update_status/:id', checkUserAuth, AdminController.update_status)

// forgetpassword
route.get('/forget', FrontController.forgetload)
route.post('/forget', FrontController.forgetverify)













module.exports = route