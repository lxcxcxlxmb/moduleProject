const { Op } = require('sequelize');
const UserModel = require('../models/User');

class UsersController {

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

    if (params.email) {
      where.email = {
        [Op.iLike]: `%${params.email}%`
      };
    }

    if (params.password) {
      where.password = {
        [Op.iLike]: `%${params.password}%`
      };
    }

    if (params.min_age) {
      where.age = {
        [Op.gte]: params.min_age
      };
    }

    if (params.max_age) {
      if (!where.age) {
        where.age = {};
      }
      where.age[Op.lte] = params.max_age;
    }

    if (params.sex) {
      where.sex = params.sex;
    }

    const users = await UserModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(users);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const user = await UserModel.create(data);
      await this._sendEmail(data.email, data.name);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  validate = async (req, res, next) => {
    try {
      const data = await this._validateLogin(req.body);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const user = await UserModel.findByPk(req.params.userId);
    res.json(user);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.userId;
      const data = await this._validateData(req.body, id);
      await UserModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await UserModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await UserModel.destroy({
      where: {
        id: req.params.userId
      }
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'age', 'sex', 'email', 'password'];
    const user = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);
    }

    return user;
  }

  _validateLogin = async (data, id) => {
    const attributes = ['name', 'password'];
    const user = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (!await this._checkIfNameAndPasswordExist(user.name, user.password, id)) {
      throw new Error(`Incorrect data`);
    }

    return user;
  }

  _checkIfEmailExists = async (email, id) => {
    const where = {
      email: email
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where
    });

    return count > 0;
  }

  _checkIfNameAndPasswordExist = async (name, password, id) => {
    const where = {
      name: name,
      password: password
    };
    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where
    });

    return count > 0;
  }

  _sendEmail = async (email, name) => {
    var nodemailer = require('nodemailer');
    let email_user = 'luca.colombo@universo.univates.br';
    let email_pass = 'L8JCtCi*NgagLrK';
    let email_to = email;
    let email_subject = 'vlw ae pelo cadastro ' + name + ' tmj';
    let email_content = 'Cadastrou-se !!!!';

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email_user,
        pass: email_pass
      }
    });

    var mailOptions = {
      from: email_user,
      to: email_to,
      subject: email_subject,
      text: email_content
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro ao enviar email: ' + error);
      }
      else {
        console.log('Email enviado: ' + info.response);
      };
    });
  }

}

module.exports = new UsersController();
