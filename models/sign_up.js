var Sequelize = require('sequelize');
const sequelize = require('../controllers/helpers/dbconnect');
  const signup = sequelize.define('sign_up', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    email: Sequelize.STRING(120),
    username: Sequelize.STRING(100),
    phone_number: Sequelize.STRING(15),
    first_name: Sequelize.STRING(60),
    last_name: Sequelize.STRING(60),
    role: {
        type: Sequelize.ENUM("admin", "user", "manager"),
        allowNull: false,
        defaultValue: "user",
      },
     password: Sequelize.TEXT,
    created_at: Sequelize.DATEONLY,
    updated_at: Sequelize.DATEONLY
  
}, {
    freezeTableName: true,
    timestamps: false
});



module.exports = signup;
