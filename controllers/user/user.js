var moment = require('moment');
var helpers = require('../helpers/common_functions');
var taskModel = require('../../models/tasks');
var signupModel = require('../../models/sign_up');
const dotenv = require('dotenv')

dotenv.config();
module.exports={
    addTask: async function (req, res) {
        try {
          const requiredFields = ["name", "start_date", "end_date", "status"];
          const missingFields = requiredFields.filter(field => !req.body[field]);
          if (missingFields.length > 0) {
            return res.status(400).json({
              error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
          }
          req.body.created_at = moment(Date.now()).format("YYYY-MM-DD")
          req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD")
          let find_task = await helpers.findOne(null, { user_id: req.body.user_id , name:req.body.name}, null, null, null, null, null, taskModel);
       
          if (find_task != null) {
            return res.status(403).json({ error: "This task name is already added" });
          }
          
          let save = await helpers.save(req.body, taskModel);
          return res.status(200).json({ status: "Task was added successfully" })
    
        } catch (error) {
          console.log(error)
          res.status(500).send({ message: error })
        }
     },
     fetchUserTasks: async function (req, res) {
        try {
         
    //       let includeIn = [
    //         {
    //           model: signupModel,
    //           as: "user_details",
    //           attributes: ["email", "first_name", "last_name", "phone_number", "username"]
    //         },
            
    //    ];
        let att =['id','start_date','end_date','remarks','status','name']
          let tasks = await helpers.findAll(att, {user_id:req.body.user_id}, null, null, null, null, [['id', 'DESC']], taskModel)
          return res.status(200).json({ tasks: tasks })
    
        } catch (error) {
          console.log(error)
          res.status(500).send({ message: error })
        }
     },
     updateTask: async function (req, res) {
        try {
            const { id } = req.params; 
            const { name, start_date, end_date, status, user_id } = req.body;
    
            const requiredFields = ["name", "start_date", "end_date", "status"];
            const missingFields = requiredFields.filter(field => !req.body[field]);
    
            if (missingFields.length > 0) {
                return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(", ")}` });
            }
    
             let existingTask = await helpers.findOne(null, { id }, null, null, null, null, null, taskModel);
    
            if (!existingTask) {
                return res.status(404).json({ error: "Task not found" });
            }
    
            let duplicateTask = await helpers.findOne(null, { user_id, name }, null, null, null, null, null, taskModel);
    
            if (duplicateTask && duplicateTask.id !== parseInt(id)) {
                return res.status(403).json({ error: "This task name is already added" });
            }
    
            req.body.updated_at = moment(Date.now()).format("YYYY-MM-DD");
            let update = await taskModel.update(req.body, { where: { id: req.params.id } })
    
            return res.status(200).json({ status: "Task was updated successfully" });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error });
        }
     },
    
     deleteTask: async function (req, res) {
        try {
          if (!req.params.id) {
            return res.status(400).json({
              error: "Bad request: missing ID",
            });
          }
          let find_task = await helpers.findOne(null, { user_id: req.body.user_id , id:req.params.id}, null, null, null, null, null, taskModel);
       
          if (find_task === null) {
            return res.status(400).json({ error: "This task ID is not valid. Please check the task ID." });
          }
          
          let delete_task = await helpers.deleteTask(req.params.id, taskModel)
    
          return res.status(200).json({ status: "Task deleted successfully" })
        } catch (error) {
          console.log(error)
          res.status(500).send({ message: error })
        }
     },
}