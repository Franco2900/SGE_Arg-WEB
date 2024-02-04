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
    </head>
    <body class='fondoClaro'>
      <h1><center>Sistema de Gestión Editorial Argentino</center></h1>

      <button id="botonCambiarFondo">Modo claro</button>

      <script>
        let botonCambiarFondo = document.getElementById("botonCambiarFondo");

        botonCambiarFondo.addEventListener("click", function(){
                    
          if(botonCambiarFondo.innerText == "Modo claro") 
          {
            botonCambiarFondo.innerText = "Modo oscuro";
            document.getElementsByTagName("body")[0].classList.remove('fondoClaro');
            document.getElementsByTagName("body")[0].classList.add('fondoOscuro');
          }
          else 
          {
            botonCambiarFondo.innerText = "Modo claro";
            document.getElementsByTagName("body")[0].classList.remove('fondoOscuro');
            document.getElementsByTagName("body")[0].classList.add('fondoClaro');
          }
                
        });
      </script>

      <p>
          Este sitio sirve para saber cuales son las revistas cientificas y educativas de la Republica Argentina. Para saber esto extraemos la 
          información de distintos sitios web.
      </p>
        
      <p>Los sitios web de los que extraemos información son: </p>
      <span>
          <a href="/revista/caicyt">  <img src="images/caicyt.jpg">CAYCIT</a>
          <a href="/revista/latindex"><img src="images/latindex.jpg">Latindex</a>
          <a href="/revista/doaj">    <img src="images/doaj.jpg">DOAJ</a>
          <a href="/revista/redalyc"> <img src="images/redalyc.jpg">Redalyc</a>
          <a href="/revista/biblat">  <img src="images/biblat.jpg">Biblat</a>
          <a href="/revista/scopus">  <img src="images/scopus.jpg">Scopus</a>
          <a href="/revista/scielo">  <img src="images/scielo.jpg">Scielo</a>
          <a href="/revista/wos">     <img src="images/wos.jpg">Web of Science</a>
          <a href="/revista/dialnet"> <img src="images/dialnet.jpg">Dialnet</a>
      </span>
        
      <p>El listado completo de las revistas de todos los sitios web se puede ver aquí</p>
      <a href="/revista/listadoRevistas/">Listado de revistas</a>
    </body>
  </html>
  `

  res.send(pagina);
});


module.exports = router;
