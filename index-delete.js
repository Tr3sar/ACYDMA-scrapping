// Importa las bibliotecas necesarias
const axios = require('axios');
const cheerio = require('cheerio');

// URL de la página web con el HTML que quieres analizar
const url = 'https://www.acydma.com/?id_menu=1&to=30&ca=35&dC=0&dP=0&lk=&men=Competiciones%20-%20Liga%20F%C3%BAtbol%20Sala%20Senior';

// Obtener clasificación
axios.get(url)
  .then((response) => {
    // Carga el HTML en Cheerio para poder analizarlo
    const $ = cheerio.load(response.data);

    // Encuentra el elemento HTML que contiene la clasificación
    const clasificacionTable = $('table').eq(1); // Cambia el selector si es necesario
    //console.log(clasificacionTable)

    // Procesa la tabla de clasificación para extraer los datos
    const equipos = [];
    clasificacionTable.find('tr').each((index, row) => {
      if (index > 0) {
        const equipo = {};
        const columns = $(row).find('td');

        equipo.nombre = columns.eq(0).text().trim();
        equipo.juegos = parseInt(columns.eq(1).text().trim(), 10);
        equipo.ganados = parseInt(columns.eq(2).text().trim(), 10);
        equipo.empatados = parseInt(columns.eq(3).text().trim(), 10);
        equipo.perdidos = parseInt(columns.eq(4).text().trim(), 10);
        equipo.golesFavor = parseInt(columns.eq(5).text().trim(), 10);
        equipo.golesContra = parseInt(columns.eq(6).text().trim(), 10);
        equipo.puntuacion = parseInt(columns.eq(7).text().trim(), 10);

        equipos.push(equipo);
      }
    });

    // Muestra los datos extraídos
    console.log(equipos);
  })
  .catch((error) => {
    console.error('Error al obtener el HTML:', error);
  });

  //Obtener resultados
  axios.get(url)
  .then((response) => {
    // Carga el HTML en Cheerio para poder analizarlo
    const $ = cheerio.load(response.data);

    // Encuentra el elemento HTML que contiene la clasificación
    const resultatsTable = $('table').eq(2); // Cambia el selector si es necesario
    //console.log(clasificacionTable)

    // Procesa la tabla de clasificación para extraer los datos
    const resultats = [];
    resultatsTable.find('tr').each((index, row) => {

        const resultat = {};
        const columns = $(row).find('td');

        resultat.nombreLocal = columns.eq(0).text().trim();
        resultat.golesLocal = parseInt(columns.eq(1).text().trim(), 10);
        resultat.golesVisitante = parseInt(columns.eq(3).text().trim(), 10);
        resultat.nombreVisitante = columns.eq(4).text().trim();

        resultats.push(resultats);
    });

    // Muestra los datos extraídos
    console.log(resultats);
  })
  .catch((error) => {
    console.error('Error al obtener el HTML:', error);
  });



//Obtener calendario
// Función para extraer los partidos por jornada
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
                Jornada: rowData[0],
                Partidos: []
            };
        } else if (rowData.length === 3) {
            // Si hay tres columnas, son los detalles del partido
            const partido = {
                EquipoLocal: rowData[0],
                EquipoVisitante: rowData[1],
                Hora: rowData[2]
            };
            currentRound.Partidos.push(partido);
        }
         }
    });

    if (Object.keys(currentRound).length !== 0) {
        schedule.push(currentRound);
    }

    return schedule;
}

// Obtener el HTML de la página
axios.get(url)
    .then(response => {
        const schedule = extractSchedule(response.data);
        return schedule;
    })
    .then(schedule => {
        console.log('Calendario de partidos por jornada:');
        console.log(schedule);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
