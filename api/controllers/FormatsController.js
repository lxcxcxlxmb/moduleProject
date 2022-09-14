const { Op } = require('sequelize');
const FormatModel = require('../models/Format');

class FormatsController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.description) {
      where.description = {
        [Op.iLike]: `%${params.description}%`
      };
    }

    const formats = await FormatModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(formats);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const format = await FormatModel.create(data);
      res.json(format);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const format = await FormatModel.findByPk(req.params.formatId);
    res.json(format);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.formatId;
      const data = await this._validateData(req.body, id);
      await FormatModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await FormatModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await FormatModel.destroy({
      where: {
        id: req.params.formatId
      }
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['description'];
    const format = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      format[attribute] = data[attribute];
    }

    if (await this._checkIfDescriptionExists(format.description, id)) {
      throw new Error(`The format with description "${format.description}" already exists.`);
    }

    return format;
  }

  _checkIfDescriptionExists = async (description, id) => {
    const where = {
      description: description
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await FormatModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new FormatsController();
