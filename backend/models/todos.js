'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todos.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
    }
  }
  Todos.init({
    todo: DataTypes.STRING,
    todoIv: DataTypes.STRING,
    todoAuthTag: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Todos',
  });
  return Todos;
};