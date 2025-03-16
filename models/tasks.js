var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');
var signupModel = require('./sign_up');
  const task = sequelize.define('tasks', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id:Sequelize.INTEGER,
    name: Sequelize.STRING(255),
    start_date: Sequelize.DATEONLY,
    end_date: Sequelize.DATEONLY,
    remarks: Sequelize.TEXT,
    status: Sequelize.STRING(20),
    created_at: Sequelize.DATEONLY,
    updated_at: Sequelize.DATEONLY
  
}, {
    freezeTableName: true,
    timestamps: false
});

task.belongsTo(signupModel, {
    foreignKey: "user_id",
    as: "user_details",
});

module.exports = task;
