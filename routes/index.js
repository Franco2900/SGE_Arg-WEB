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
      
      <span>

        <div class="row">

          <div class="col-md-4 text-center">
            <a href="/revista/caicyt">
              <img src="images/caicyt.jpg" class="mx-auto d-block">
              <br/>
              CAYCIT
            </a>
          </div>

          <div class="col-md-4 text-center">
            <a href="/revista/latindex">
              <img src="images/latindex.jpg" class="mx-auto d-block">
              <br/>
              Latindex
            </a>
          </div>

          <div class="col-md-4 text-center">
            <a href="/revista/doaj">
              <img src="images/doaj.jpg" class="mx-auto d-block">
              <br/>
              DOAJ
            </a>
          </div>

        </div>

        <br></br>

        <div class="row">

          <div class="col-md-4 text-center">
            <a href="/revista/redalyc">
              <img src="images/redalyc.jpg" class="mx-auto d-block" style="width: 80%;">
              <br/>
              Redalyc
            </a>
          </div>

          <div class="col-md-4 text-center">
          <a href="/revista/biblat">
            <img src="images/biblat.jpg" class="mx-auto d-block" style="width: 80%;">
            <br/>
            Biblat
          </a>
          </div>

          <div class="col-md-4 text-center">
            <a href="/revista/scopus">
              <img src="images/scopus.jpg" class="mx-auto d-block">
              <br/>
              Scopus
            </a>
          </div>

        </div>

        <br></br>

        <div class="row">

          <div class="col-md-4 text-center">
            <a href="/revista/scielo">
              <img src="images/scielo.jpg" class="mx-auto d-block">
              </br>
              Scielo
            </a>
          </div>

          <div class="col-md-4 text-center">
            <a href="/revista/wos">
              <img src="images/wos.jpg" class="mx-auto d-block" style="width: 80%;">
              </br>
              Web of Science
            </a>
          </div>

          <div class="col-md-4 text-center">
            <a href="/revista/dialnet">
              <img src="images/dialnet.jpg" class="mx-auto d-block">
              <br/>
              Dialnet
            </a>
          </div>

        </div>

        <br></br>

      </span>
        
      <p>El listado completo de las revistas de todos los sitios web se puede ver aquí</p>
      
      <div class="col-md-12 text-center">
        <a href="/revista/listadoRevistas/">
          <img src="images/listado.png" class="mx-auto d-block" style="height: 10%; width: 20%;">
          <br/>
          Listado de revistas
        </a>
      </div>

      <br></br>

    </body>
  </html>
  `

  res.send(pagina);
});


module.exports = router;
