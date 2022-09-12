const { Op } = require('sequelize');
const LogModel = require('../models/Log');

class LogsController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.action) {
      where.action = {
        [Op.iLike]: `%${params.action}%`
      };
    }

    const logs = await LogModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(logs);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const log = await LogModel.create(data);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const log = await LogModel.findByPk(req.params.logId);
    res.json(log);
  }

}

module.exports = new LogsController();
