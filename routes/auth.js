var express = require('express');
var router = express.Router();
var authenticationController = require('../controllers/auth/auth');


router.post('/sign-up', authenticationController.signUp);
router.post('/sign-in', authenticationController.signIn);

module.exports = router;

