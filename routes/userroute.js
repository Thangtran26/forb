const express = require('express');
const passport = require('passport')
const router = express.Router();
const usercontroller = require('../controller/usercontroller');
const querycontroller = require('../controller/querycontroller');
const upload = require('../routes/upload');
router.route('/').get(usercontroller.getusers);
router.route('/signup').post(usercontroller.signup);
router.route('/signin').post(usercontroller.signin);
router.route('signin/google').post(usercontroller.signingg);
router.route('/like').post(usercontroller.like);
router.route('/:id').get(usercontroller.getoneuser)
.put(upload.single('avatar'), usercontroller.updateuser)
.delete(usercontroller.deleteuser)
.post(usercontroller.changepassword);
router.route('/:id/search').get(querycontroller.filterinfo);
router.route('/:id/getcrush').get(usercontroller.getcrush);

module.exports = router;
