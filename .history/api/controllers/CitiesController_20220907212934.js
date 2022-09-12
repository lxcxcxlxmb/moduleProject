const { Op, QueryTypes } = require('sequelize');
const CityModel = require('../models/City');
const StateModel = require('../models/State');
const db = require('../db');

class CitiesController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }

    if (params.state_id) {
      where.state_id = {
        [Op.eq]: params.state_id
      };
    }

    const cities = await db.query('SELECT cities.id, cities.name, states.province AS "State" FROM cities, states WHERE states.id = cities.state_id', { type: QueryTypes.SELECT });

    res.json(cities);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const city = await CityModel.create(data);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const city = await CityModel.findByPk(req.params.cityId);
    res.json(city);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.cityId;
      const data = await this._validateData(req.body, id);
      await CityModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await CityModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await CityModel.destroy({
      where: {
        id: req.params.cityId
      }
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'state_id'];
    const city = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      city[attribute] = data[attribute];
    }

    if (await this._checkIfCityExists(city.name, id)) {
      throw new Error(`The city of "${city.name}" already exists.`);
    }

    return city;
  }

  _checkIfCityExists = async (name, id) => {
    const where = {
      name: name
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await CityModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new CitiesController();
