const router = require('express').Router();
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
