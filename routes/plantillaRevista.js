const fs = require('fs');

// Clase para pasar el texto de los archivos JSON a objetos
class Revista {
    
    constructor(tituloRevista, issnImpreso, issnEnLinea, instituto) {
        this.tituloRevista = tituloRevista;
        this.issnImpreso   = issnImpreso;
        this.issnEnLinea   = issnEnLinea;
        this.instituto     = instituto;
    }

    toString() {
        console.log(`Título: ${this.tituloRevista}, ISSN impreso: ${this.issnImpreso}, ISSN en linea: ${this.issnEnLinea}, Instituto: ${this.instituto}`);
    }
}

// Crea un arreglo de objetos con la información de las revistas
function crearListado(archivoJSON){

    var revistas = [];
    
    for (var i = 0; i < archivoJSON.length; i++)
    {
        if (archivoJSON[i].Título == "HUBO UN ERROR") revistas.push(new Revista("HUBO UN ERROR") );
        else                                          revistas.push(new Revista(archivoJSON[i].Título, archivoJSON[i]['ISSN impresa'], archivoJSON[i]['ISSN en linea'], archivoJSON[i]['Instituto']));
    }

    return revistas;
}

// Crea una tabla HTML con el arreglo de revistas pasado, sin importar el tamaño del arreglo
function armarTablaDeRevistas(arregloRevistas, numeroPagina){

    let tabla = 
    `<table id="tablaRevistas" border="1" class="table table-light table-striped table-bordered">
        <thead>
            <tr>
                <th class="text-center">N° Revista</th>
                <th class="text-center">Titulo</th>
                <th class="text-center">ISSN impreso</th>
                <th class="text-center">ISSN electronico</th>
                <th class="text-center">Instituto/Editorial</th>
            </tr>
        </thead>`

    if(numeroPagina > 1) numeroPagina = (numeroPagina * 20) - 19;

    for(let i = 0; i < arregloRevistas.length; i++){
        tabla += `<tr>
                    <td class="text-center">${numeroPagina}</td>
                    <td>${arregloRevistas[i].tituloRevista}</td>
                    <td class="text-center">${arregloRevistas[i].issnImpreso}</td>
                    <td class="text-center">${arregloRevistas[i].issnEnLinea}</td>
                    <td>${arregloRevistas[i].instituto}</td>
                 </tr>`
        
        numeroPagina++;
    }

    tabla += `</table>`

    return tabla;
}


// Armo el HTML que se va a mostrar. Funciona como una especie de plantilla
function armarHTML(archivoJSON, tituloSitioWeb){

    let revistas         = crearListado(archivoJSON);
    let cantidadRevistas = archivoJSON.length;
    let cantidaPaginas   = Math.ceil(cantidadRevistas / 20);

    let primeras20Revistas = [];
    for(let i = 0; i < 20; i++) 
    {
        if(i == revistas.length-1)  i = 20;
        else                        primeras20Revistas.push(revistas[i]);
    }


    let pagina = 
    `<!DOCTYPE html>
    <html>
        <head>

            <title id="titulo">${tituloSitioWeb}</title>

            <link rel="stylesheet" type="text/css" href="/stylesheets/estilos.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

        </head>
        <body class='fondoClaro container-fluid'>

            <h1 style="text-align: center;">${tituloSitioWeb}</h1>
    `

    // Cambiar a algo más simple para ahorrar lineas <img src="images/${tituloSitioWeb}.jpg">
    switch(tituloSitioWeb)
    {
        case 'CAICYT':
            pagina += `<img src="images/caicyt.jpg" class="mx-auto d-block"/> <br/>`;
            break;
        
        case 'Latindex':
            pagina += `<img src="images/latindex.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'DOAJ':
            pagina += `<img src="images/doaj.jpg" class="mx-auto d-block" /> <br/>`;
            break;
        
        case 'Redalyc':
            pagina += `<img src="images/redalyc.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'Biblat':
            pagina += `<img src="images/biblat.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'Scopus':
            pagina += `<img src="images/Scimago.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'Scielo':
            pagina += `<img src="images/scielo.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'WoS':
            pagina += `<img src="images/WoS.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'Dialnet':
            pagina += `<img src="images/dialnet.jpg" class="mx-auto d-block" /> <br/>`;
            break;

        case 'Listado de revistas':
            pagina += `<img src="images/listado.png" class="mx-auto d-block" style="height: 15vh;" />
                        <br/>`;
            break;
    }

    pagina += 
            `
            <div class="row">

                <div class="col-md-6 text-start">
                    <button id="botonCambiarFondo" class="bi bi-lightbulb">Modo claro</button>
                </div>

                <div class="col-md-6 text-end">
                    <a href="http://localhost:3000/api/descargarCSV?archivoCSV=${tituloSitioWeb}">
                        <button id="botonDescargarCSV">
                            Descargar CSV
                            <span class="bi bi-download"></span>
                        </button>
                    </a>

                    <a href="http://localhost:3000/api/descargarJSON?archivoJSON=${tituloSitioWeb}">
                        <button id="botonDescargarJSON">
                            Descargar JSON
                            <span class="bi bi-download"></span>
                        </button>
                    </a>
                </div>

            </div>
            <br/>
    `

    /* Poner el texto de cambiar fondo a la izquierda y los de descarga a la derecha */

    if(tituloSitioWeb == 'Listado de revistas') pagina +=  `<p>Estas son todas las revistas argentinas que se pudieron encontrar en todos los sitios web</p>`
    else                                        pagina +=  `<p>Estas son las revistas argentinas que se encuentran en el sitio web ${tituloSitioWeb}</p>`
            
    pagina += 
    `
        <p>Página <span id="paginaActual">1</span> de <span id="cantidaPaginas">${cantidaPaginas}</span></p>

        <button id="botonPrimeraPagina"> <<< </button>
        <button id="botonAnterior">       <  </button>
        <input id="buscarPaginaEspecifica" type="number" placeholder="Ingrese página a buscar">
        <button id="botonSiguiente">      >  </button>
        <button id="botonUltimaPagina">  >>> </button>     
        
        <br><br/>
    `

    pagina += armarTablaDeRevistas(primeras20Revistas, 1);

    if(tituloSitioWeb == 'Listado de revistas') pagina += `<p>Cantidad de revistas argentinas: ${cantidadRevistas}</p>`
    else                                        pagina += `<p>Cantidad de revistas en ${tituloSitioWeb}: ${cantidadRevistas}</p>`

    let estadisticasDelArchivo = fs.statSync(`./SGE_Arg/Revistas/${tituloSitioWeb}.json`);
    let fechaUltimaModicacion = estadisticasDelArchivo.mtime;

    pagina +=
        `
            <p>Última actualización: ${fechaUltimaModicacion.getDate()}/${fechaUltimaModicacion.getMonth()+1}/${fechaUltimaModicacion.getFullYear()} (DD/MM/YY)</p>
            <p><button id="actualizarCatalogo">Actualizar catálogo de revistas</button></p>

            <p><a href="/">Volver</a></p>

            <script src="/javascripts/funcionesPlantillaRevista.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

        </body>
    </html>`
    // getMonth() devuelve un valor entre 0 y 11, siendo 0 el mes de Enero; por eso se le suma uno

    return pagina;
}


function armarHTMLvacio(tituloSitioWeb){

    let pagina = 
    `<!DOCTYPE html>
    <html>
        <head>
            <title id="titulo">${tituloSitioWeb}</title>

            <link rel="stylesheet" type="text/css" href="/stylesheets/estilos.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

        </head>
        <body class='container-fluid'>
            <h1 style="text-align: center;">${tituloSitioWeb}</h1>
    `
            
    if(tituloSitioWeb == 'Listado de revistas') pagina += `<p>Todavía no esta armado el listado de revistas</p>`
    else                                        pagina += `<p>No hay datos disponibles sobre la revista ${tituloSitioWeb}</p> `


    pagina += 
    `    
            <p>Seleccione la opción 'Actualizar catálogo de revistas' para obtener datos</p>
            <p><button id="actualizarCatalogo">Actualizar catálogo de revistas</button></p>

            <script>

                document.getElementById("actualizarCatalogo").addEventListener("click", function(){

                    let tituloSitioWeb = document.getElementById("titulo").innerText;
                
                    const xhttp = new XMLHttpRequest();    
                    xhttp.open("POST", "http://localhost:3000/api/actualizarCatalogo", true); 
                    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    
                    xhttp.onreadystatechange = function() 
                    {         
                        if (this.readyState == 4 && this.status == 200)
                        {
                            location.reload();
                        }
                    };
                
                    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb});
                    xhttp.send(body);
                })

            </script>

            <p><a href="/">Volver</a></p>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

        </body>
    </html>
    `;

    return pagina;
}

exports.crearListado = crearListado;
exports.armarTablaDeRevistas = armarTablaDeRevistas;
exports.armarHTML = armarHTML;
exports.armarHTMLvacio = armarHTMLvacio;