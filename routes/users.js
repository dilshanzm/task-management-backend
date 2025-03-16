var express = require('express');
var router = express.Router();
var userController = require('../controllers/user/user');
var authenticationController = require('../controllers/auth/auth');
var helpers = require('../controllers/helpers/common_functions');
var signupModel = require('../models/sign_up');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
router.use(async function  (req, res, next) { 
   
    let accessTokenFromClient;
    if (req.headers.authorization) {
        if (req.headers.authorization.split(' ')[0] === 'Bearer') {
            accessTokenFromClient = req.headers.authorization.split(' ')[1]
        } else {
            accessTokenFromClient = req.headers.authorization
        }
    }
    if (!accessTokenFromClient){
        return res.status(401).send({ success: 0, message: "Authorization Token missing from header" ,code: 401});
    } 
    jwt.verify(accessTokenFromClient,process.env.SECRET_KEY, async (error,response)=>{
        if(error){
           return res.status(403).json({ verified:false, message:'invalid token'})
         }
        
        let user =  await helpers.findOne(null, {email:response.email}, null, null, null, null, null, signupModel)
        req.body.user_id =user.dataValues.id
        req.body.role=user.dataValues.role
        next();
       
     })
});
//verify access token
 router.get('/verify-token', authenticationController.verifyToken);

 router.post('/', userController.addTask);
 router.get('/', userController.fetchUserTasks);
 router.put('/:id', userController.updateTask)
 router.delete('/:id', userController.deleteTask)

module.exports = router;

