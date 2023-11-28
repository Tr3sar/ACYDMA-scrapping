const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.acydma.com/?id_menu=1&to=30&ca=35&dC=0&dP=0&lk=&men=Competiciones%20-%20Liga%20F%C3%BAtbol%20Sala%20Senior';

const getClassificacio = async function () {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        //Inici scrapping
        const classificacioTable = $('table').eq(1);
        const equips = [];
        classificacioTable.find('tr').each((index, row) => {
            if (index > 0) {
                const equip = {};
                const columns = $(row).find('td');

                equip.nombre = columns.eq(0).text().trim();
                equip.juegos = parseInt(columns.eq(1).text().trim(), 10);
                equip.ganados = parseInt(columns.eq(2).text().trim(), 10);
                equip.empatados = parseInt(columns.eq(3).text().trim(), 10);
                equip.perdidos = parseInt(columns.eq(4).text().trim(), 10);
                equip.golesFavor = parseInt(columns.eq(5).text().trim(), 10);
                equip.golesContra = parseInt(columns.eq(6).text().trim(), 10);
                equip.puntuacion = parseInt(columns.eq(7).text().trim(), 10);

                equips.push(equip);
            }
        });

        return equips;

    } catch (err) {
        throw new Error('Error obtenint la classificació.')
    }
}

const getResultats = async function () {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const resultatsTable = $('table').eq(2);

        const resultats = [];
        resultatsTable.find('tr').each((index, row) => {

            const resultat = {};
            const columns = $(row).find('td');

            resultat.nombreLocal = columns.eq(0).text().trim();
            resultat.golesLocal = parseInt(columns.eq(1).text().trim(), 10);
            resultat.golesVisitante = parseInt(columns.eq(3).text().trim(), 10);
            resultat.nombreVisitante = columns.eq(4).text().trim();

            //Amb push donava error
            resultats[index] = resultat;
            console.log(resultats)
        });

        return resultats;

    } catch (err) {
        throw new Error('Error obtenint els resultats.')
    }
}

const getCalendari = async function () {
    try {
        const response = await axios.get(url);
        const calendari = await extractSchedule(response.data);

        return calendari;

    } catch (err) {
        throw new Error('Error obtenint el calendari.')
    }
}


async function extractSchedule(html) {
    const $ = cheerio.load(html);

    const schedule = [];
    let currentRound = {};

    // Buscar la tabla específica por su ID
    const table = $('#calendario'); // Reemplaza 'calendario' con el ID real de tu tabla

    // Verificar si se encontró la tabla
    if (table.length === 0) {
        console.error('No se encontró la tabla del calendario');
        return schedule;
    }

    // Buscar todas las filas en la tabla
    table.find('tr').each((index, element) => {
        if (index > 0) {
            const rowData = $(element).find('td').map((i, el) => $(el).text().trim()).get();

            // Si el número de columnas es 1, es el nombre de la jornada
            if (rowData.length === 1) {
                if (Object.keys(currentRound).length !== 0) {
                    schedule.push(currentRound);
                }

                currentRound = {
                    nomJornada: rowData[0],
                    partits: []
                };
            } else if (rowData.length === 3) {
                // Si hay tres columnas, son los detalles del partido
                const partit = {
                    equipLocal: rowData[0],
                    equipVisitant: rowData[1],
                    horaLloc: rowData[2]
                };
                currentRound.partits.push(partit);
            }
        }
    });

    if (Object.keys(currentRound).length !== 0) {
        schedule.push(currentRound);
    }

    return schedule;
}

module.exports = {
    getClassificacio,
    getResultats,
    getCalendari
}