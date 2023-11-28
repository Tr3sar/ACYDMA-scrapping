const AcydmaService = require('../services/acydma.service');

const getClassificacio = async (req, res) => {
    try{
        const classificacio = await AcydmaService.getClassificacio();
        res.status(200).json(
            classificacio
        )
    } catch (err) {
        res.status(400).json({
            msg: err.toString()
        });
    }
}

const getResultats = async (req, res) => {
    try{
        const resultats = await AcydmaService.getResultats();
        res.status(200).json(
            resultats
        )
    } catch (err) {
        res.status(400).json({
            msg: err.toString()
        });
    }
}

const getCalendari = async (req, res) => {
    try{
        const calendari = await AcydmaService.getCalendari();
        res.status(200).json(
            calendari
        )
    } catch (err) {
        res.status(400).json({
            msg: err.toString()
        });
    }
}

module.exports = {
    getClassificacio,
    getResultats,
    getCalendari
}