const acydmaRouter = require('express').Router();

const { getClassificacio, getResultats, getCalendari } = require('../controllers/acydma.controller');



acydmaRouter.get('/classificacio', getClassificacio);
acydmaRouter.get('/resultats', getResultats);
acydmaRouter.get('/calendari', getCalendari);

module.exports = acydmaRouter;
