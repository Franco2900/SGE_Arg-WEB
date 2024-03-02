const fs = require('fs');
const path = require('path');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let pagina = 
  `<!DOCTYPE html>
  <html>
    <head>
        <title id="titulo">Sistema de Gestión Editorial Argentino</title>
        
        <link rel="stylesheet" type="text/css" href="/stylesheets/estilos.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    </head>
    <body class='fondoClaro container-fluid'>
      <h1><center>Sistema de Gestión Editorial Argentino</center></h1>

      <div class="row">
        <div class="col-md-6 text-start">
          <button id="botonCambiarFondo" class="bi bi-lightbulb">Modo claro</button>
        </div>
      </div>

      <script>
        let botonCambiarFondo = document.getElementById("botonCambiarFondo");
                  
        botonCambiarFondo.addEventListener("click", function(){
                            
            if(botonCambiarFondo.innerText == "Modo claro") 
            {
              document.getElementsByTagName("body")[0].classList.remove('fondoClaro');
              document.getElementsByTagName("body")[0].classList.add('fondoOscuro');
        
              botonCambiarFondo.innerText = "Modo oscuro";
              botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb-off');
        
              document.getElementById("tablaRevistas").setAttribute('class', 'table table-dark table-striped table-bordered');
            }
            else 
            {
              document.getElementsByTagName("body")[0].classList.remove('fondoOscuro');
              document.getElementsByTagName("body")[0].classList.add('fondoClaro');
        
              botonCambiarFondo.innerText = "Modo claro";
              botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb');
        
              document.getElementById("tablaRevistas").setAttribute('class', 'table table-light table-striped table-bordered');
            }
                            
        });
      </script>

      <p>
          Este sitio sirve para saber cuales son las revistas cientificas y educativas de la Republica Argentina. Para saber esto extraemos la 
          información de distintos sitios web.
      </p>
        
      <p>Los sitios web de los que extraemos información son: </p>
    `

    let revistas = ['CAICYT', 'Latindex', 'DOAJ', 'Redalyc', 'Biblat', 'Scimago', 'Scielo', 'WoS', 'Dialnet'];

    // LAS REVISTAS
    for(let i = 0; i < revistas.length; i++){

      if(i%3 == 0) pagina += `<div class="row">`;

      pagina +=
      `
      <div class="col-md-4 text-center">
        <a href="/revista/${revistas[i]}">
          <img src="images/${revistas[i]}.jpg" class="mx-auto d-block border border-dark">
          <br/>
          ${revistas[i]}
        </a>
      </div>
      `
  
      if(i == 2 || i == 5 || i == 8) pagina += `</div> <br></br>`;
    }


    // EL LISTADO
    pagina +=
    `
    <p>El listado completo de las revistas de todos los sitios web se puede ver aquí</p>
      
    <div class="text-center">
      <a href="/revista/listadoRevistas/">
        <img src="images/Listado de revistas.jpg" class="mx-auto d-block border border-dark" style="height: 10%; width: 20%;">
        <br/>
        Listado de revistas
      </a>
    </div>

    <br></br>
    `


    // TABLA QUE MUESTRA EL ESTADO DE LOS ARCHIVOS
    pagina +=
    `
      <table class="text-center table table-bordered">
        <caption>Se considera que una revista tiene datos desactualizados si ya pasaron más de 30 días desde su última actualización</caption>
        <thead>
          <tr>
            <th>Revista</th>
            <th>Estado</th>
            <th>Ultima actualización (DD/MM/YY)</th>
          </tr>
        </thead>
        <tbody>
    `  

    for(let i = 0; i < revistas.length; i++){
      
      let fechaUltimaModicacionDelArchivo = "";
      let colorEstadoDelArchivo = "";
      let mensajeEstadoDelArchivo = "";

      try
      {
        // Me fijo la fecha de modificación del archivo
        let estadisticasDelArchivo;
        if(revistas[i] == 'Web of Science') estadisticasDelArchivo = fs.statSync(path.join(__dirname + `/../SGE_Arg/Revistas/WoS.json`));
        else                                estadisticasDelArchivo = fs.statSync(path.join(__dirname + `/../SGE_Arg/Revistas/${revistas[i]}.json`));
        
        let fechaModicacion = estadisticasDelArchivo.mtime;
        fechaUltimaModicacionDelArchivo = `${fechaModicacion.getDate()}/${fechaModicacion.getMonth()+1}/${fechaModicacion.getFullYear()}`;
        // getMonth() devuelve un valor entre 0 y 11, siendo 0 el mes de Enero; por eso se le suma uno

        // Me fijo el estado del archivo. Verde para datos actualizados, amarillo para datos desactualizados y rojo para cuando no hay datos
        let fechaActual = new Date();

        let diferenciaDeTiempo = (fechaActual.getFullYear() - fechaModicacion.getFullYear() ) * 12; // A la diferencia en años la multiplicamos por 12 para tener la diferencia en meses
        diferenciaDeTiempo += fechaActual.getMonth()+1;     // Le sumo los meses actuales
        diferenciaDeTiempo -= fechaModicacion.getMonth()+1; // Le resto los meses que ya pasaron
        diferenciaDeTiempo *= 30  // A la diferencia en meses la multiplicamos por 30 para tener la diferencia en días

        if(diferenciaDeTiempo > 30) 
        {
          colorEstadoDelArchivo = 'yellow';
          mensajeEstadoDelArchivo = 'Datos desactualizados';
        }
        else
        {
          colorEstadoDelArchivo = 'green';
          mensajeEstadoDelArchivo = 'Datos al día';
        }

      }
      catch(error)
      {
        mensajeEstadoDelArchivo = 'No hay datos disponibles';
        colorEstadoDelArchivo = 'red';
      }
                                                       

      pagina += 
      `
      <tr>
        <td>${revistas[i]}</td>
        <td style="background-color: ${colorEstadoDelArchivo};">${mensajeEstadoDelArchivo}</td>
        <td>${fechaUltimaModicacionDelArchivo}</td>
      </tr>
      `
    }

    pagina +=
    `
        </tbody>
      </table>

      <br/>

    </body>
  </html>
  `

  res.send(pagina);
});


module.exports = router;
