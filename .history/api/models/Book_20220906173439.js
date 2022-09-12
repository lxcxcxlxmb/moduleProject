const { DataTypes, Model } = require('sequelize');
const db = require('../db');
const Publisher = require('./Publisher');
const Category = require('./Category');

class Book extends Model { };

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publication_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  },
  publisher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Publisher,
      key: 'id'
    }
  }
}, {
  sequelize: db,
  tableName: 'books',
  modelName: 'Book'
});

module.exports = Book;
