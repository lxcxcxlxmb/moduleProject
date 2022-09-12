const { DataTypes, Model } = require('sequelize');
const db = require('../db');
const City = require('./City');

class City extends Model { };

City.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
    references: {
      model: State,
      key: 'id'
    }
  }
}, {
  sequelize: db,
  tableName: 'cities',
  modelName: 'City'
});

module.exports = City;
