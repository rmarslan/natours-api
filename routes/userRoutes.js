const router = require('express').Router();
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get('/me', authController.protect, authController.getLoggedInUser);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

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
