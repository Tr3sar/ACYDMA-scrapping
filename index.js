const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')

const acydmaRouter = require('./routes/acydma.routes')

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json())
app.use('/api', acydmaRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});