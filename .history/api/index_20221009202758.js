require('dotenv').config();

require('./db');

const express = require('express');
const routes = require('./routes');

import express from 'express';
import cors from 'cors';
import User from './models/User';
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

// app.use(express.static(path.join(__dirname)));

app.use(cors());

async function authentication(request) {
  let authorization = request.headers.authorization + '';
  authorization = authorization.replace('Basic ', '');
  let ascii = Buffer.from(authorization, 'base64').toString('ascii');
  let dados = ascii.split(':');
  console.log(authorization);
  console.log(ascii);

  let username = dados[0];
  let password = dados[1];

  let logado = await Usuario.localizaUsuario(username, password);
  console.log(logado?.toJSON());
  return logado;
}

app.get('/auth', async function (request, response) {
  response.json(await authentication(request));
});

app.get('/verify', async function (request, response) {
  let usuario = await authentication(request);
  response.json(usuario);
});

app.use(routes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
