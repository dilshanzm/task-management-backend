var moment = require('moment');
var helpers = require('../helpers/common_functions');
var signupModel = require('../../models/sign_up');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

module.exports={
    signUp: async function (req, res) {
        try {
          const requiredFields = ["email", "username", "phone_number","first_name","last_name", "password",];
          const missingFields = requiredFields.filter(field => !req.body[field]);
    
          if (missingFields.length > 0) {
            return res.status(400).json({
              error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
          }
          req.body.created_at = moment(Date.now()).format("YYYY-MM-DD")
          req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD")
          let user_email         = await helpers.findOne(null, { email: req.body.email }, null, null, null, null, null, signupModel)
          let user_phone_number  = await helpers.findOne(null, { phone_number: req.body.phone_number }, null, null, null, null, null, signupModel)
          let user_username      = await helpers.findOne(null, { username: req.body.username }, null, null, null, null, null, signupModel)
    
          if (user_email != null) {
            return res.status(403).json({ error: 'This user email already added' })
          }
          if (user_phone_number != null) {
            return res.status(403).json({ error: 'This phone number already added' })
          }
          if (user_username != null) {
            return res.status(403).json({ error: 'This username already added' })
          }
          //password operation
          let encrypted_password = bcryptjs.hashSync(req.body.password.trim(), 10);
          req.body.password = encrypted_password
          const userInfoUsername = {
            email: req.body.email,
            name: `${req.body.first_name} ${req.body.last_name}`
          }
          let save = await helpers.save(req.body, signupModel);
          let token = await jwt.sign(userInfoUsername, process.env.SECRET_KEY, {
            expiresIn: '24h' //15m
          })
          let data = {
            id          : save.dataValues.id,
            first_name  : req.body.first_name,
            last_name   : req.body.last_name,
            email       : req.body.email,
            role        : save.dataValues.role,
            phone_number: req.body.phone_number,
            username    : req.body.username,
            token       : token

          }
          return res.status(201).json({ status: "success", message: "Registration Successful", user_attributes: data  });
          
      } catch (error) {
          console.log(error)
          res.status(500).send({ message: error })
        }
    },
    signIn: async function (req, res) {
        try {
          const requiredFields = ["username", "password"];
          const missingFields = requiredFields.filter(field => !req.body[field]);
    
          if (missingFields.length > 0) {
            return res.status(400).json({
              error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
          }
          let find_user_phone_number = await helpers.findOne(null, { phone_number: req.body.username }, null, null, null, null, null, signupModel);
          let find_user_email = await helpers.findOne(null, { email: req.body.username }, null, null, null, null, null, signupModel);
          let find_user_username = await helpers.findOne(null, { username: req.body.username }, null, null, null, null, null, signupModel);
          if ((find_user_phone_number == null) && (find_user_email == null) && (find_user_username == null)) {
            return res.status(403).json({ status: "Incorrect Username" })
          }
          if (find_user_phone_number != null) {
            if (!bcryptjs.compareSync(req.body.password, find_user_phone_number.dataValues.password)) {
              return res.status(403).json({ status: "Incorrect Password" })
            }
            if (bcryptjs.compareSync(req.body.password, find_user_phone_number.dataValues.password)) {
              //Generate JWT
              const userInfoUsername = {
                email: find_user_phone_number.dataValues.email,
                name: `${find_user_phone_number.dataValues.first_name} ${find_user_phone_number.dataValues.last_name}`
              }
    
              let token = await jwt.sign(userInfoUsername, process.env.SECRET_KEY, {
                expiresIn: '24h' //15m
              })
              let data = {
                id          : find_user_phone_number.dataValues.id,
                first_name  : find_user_phone_number.dataValues.first_name,
                last_name   : find_user_phone_number.dataValues.last_name,
                email       : find_user_phone_number.dataValues.email,
                role        : find_user_phone_number.dataValues.role,
                phone_number: find_user_phone_number.dataValues.phone_number,
                username    : find_user_phone_number.dataValues.username,
                token       : token
    
              }
              return res.status(200).json({ status: "Login was successful", user_attributes: data })
    
    
            }
          }
    
          if (find_user_email != null) {
            if (!bcryptjs.compareSync(req.body.password, find_user_email.dataValues.password)) {
              return res.status(403).json({ status: "Incorrect Password" })
            }
            if (bcryptjs.compareSync(req.body.password, find_user_email.dataValues.password)) {
              //Generate JWT
              const userInfoEmail = {
                email: req.body.username,
                name: `${find_user_email.dataValues.first_name} ${find_user_email.dataValues.last_name}`
              }
    
              let token = await jwt.sign(userInfoEmail, process.env.SECRET_KEY, {
                expiresIn: '24h' //15m
              })
    
              let data = {
                id          : find_user_email.dataValues.id,
                first_name  : find_user_email.dataValues.first_name ,
                last_name   : find_user_email.dataValues.last_name,
                email       : find_user_email.dataValues.email,
                role        : find_user_email.dataValues.role,
                phone_number: find_user_email.dataValues.phone_number,
                username    : find_user_email.dataValues.username,
                token       : token
    
              }
              return res.status(200).json({ status: "Login was successful", user_attributes: data })
    
            }
          }
    
          if (find_user_username != null) {
            if (!bcryptjs.compareSync(req.body.password, find_user_username.dataValues.password)) {
              return res.status(403).json({ status: "Incorrect Password" })
            }
            if (bcryptjs.compareSync(req.body.password, find_user_username.dataValues.password)) {
              //Generate JWT
              const userInfoEmail = {
                email: find_user_username.dataValues.email,
                name: `${find_user_username.dataValues.first_name} ${find_user_username.dataValues.last_name}`
              }
    
              let token = await jwt.sign(userInfoEmail, process.env.SECRET_KEY, {
                expiresIn: '24h' //15m
              })
    
    
              let data = {
                id          : find_user_username.dataValues.id,
                name        : find_user_username.dataValues.first_name ,
                last_name   : find_user_username.dataValues.last_name,
                email       : find_user_username.dataValues.email,
                role        : find_user_username.dataValues.role,
                phone_number: find_user_username.dataValues.phone_number,
                username    : find_user_username.dataValues.username,
                token       : token
    
              }
              return res.status(200).json({ status: "Login was successful", user_attributes: data })
            }
          }
    
        } catch (error) {
          console.log(error)
          res.status(500).send({ message: error })
        }
    },
    verifyToken: async function (req, res) {
      try {
        return res.status(200).json({ status: "verified" })
  
      } catch (error) {
        console.log(error)
        res.status(500).send({ message: error })
      }
   },
}