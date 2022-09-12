const { DataTypes, Model } = require('sequelize');
const db = require('../db');
const City = require('./City');

class Publisher extends Model { };

Publisher.init({
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
  city_id: {
    type: DataTypes.INTEGER,
    references: {
      model: City,
      key: 'id'
    }
  }
}, {
  sequelize: db,
  tableName: 'publishers',
  modelName: 'Publisher'
});

module.exports = Publisher;
