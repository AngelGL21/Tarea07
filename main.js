const express = require('express');
const app = express();
const mysql = require('mysql2');
const $ = require('jquery');

const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'angel123',
  database: 'peliculas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.get('/', (req, res) => {
  const query = 'SELECT * FROM peliculas';

  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      return;
    }

    const peliculasHTML = rows.map((pelicula) => `
      <div class="card shadow">
        <img src="${pelicula.portada}" class="card-img-top" alt="${pelicula.titulo}">
          <h5 class="title">${pelicula.titulo}</h5>
          <p class="text">${pelicula.descripcion}</p>
          <p class="text">Año de lanzamiento: ${pelicula.anio_lanzamiento}</p>
          <p class="text">Duración: ${pelicula.duracion} minutos</p>
          <p class="text">Clasificación: ${pelicula.clasificacion}</p>
    
      </div>
    `).join('');

    res.send(`
      <body>
      <section class="layout">
          <div class="body" id="contenido">
              <div class="conten_videos" id="conten_peli">
                  <h3>Péliculas</h3>
                  <div class="peliculas" id="peliculas">
                      <!-- Aquí se mostrarán las películas -->
                      ${peliculasHTML}
                  </div>
              </div>
          </div>
      </section>        
      <style>
    .layout {
    width: 100%;
    height: 1200px;
    background-color: #0C151C;
    color: white;
    }

    body{
    margin: 0; 
    background-color: #0C151C;
    }

    .body { 
    gap: 40px;
    margin: 40px;   
    }

    .peliculas {
    width: 100%;
    display: grid;
    grid-template-rows: 2fr;
    grid-template-columns: repeat(5, 1fr);
    gap: 300px 60px;
    color: white;
    }

    .card {
    width: 190px;
    height: 254px;
    border-radius: 10px;
    transition: border-radius 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
   }
   
    .shadow {
    box-shadow: inset 0 -3em 3em rgba(0,0,0,0.1),
                0 0  0 2px rgb(190, 190, 190),
                0.3em 0.3em 1em rgba(0,0,0,0.3);
    }

    .card img {
    width: 190px;
    height: 250px;
    border-radius: 10px;
    }
    </style>
  </body>
    `);
  });
});