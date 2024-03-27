const fs = require('fs');
const path = require('path'); // Módulo para trabajar con rutas

const armadoDeTabla = require('./armadoDeTabla.js') // Arma el HTML de las revistas

// Armo el HTML que se va a mostrar. Funciona como una especie de plantilla
function armarHTML(tituloSitioWeb){

    delete require.cache[require.resolve(__dirname + `/../SGE_Arg/Revistas/${tituloSitioWeb}.json`)]; // Borra la cache del archivo indicado para que cuando se lo vuevla a llamar al archivo no vuelva con datos viejos
    let archivoJSON    = require(path.join(__dirname + `/../SGE_Arg/Revistas/${tituloSitioWeb}.json`));

    let revistas;
    if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
    else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)

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

    // Foto de la revista
    if(tituloSitioWeb != 'Listado de revistas') pagina += `<img src="images/${tituloSitioWeb}.jpg" class="mx-auto d-block border border-dark"/> <br/>`
    else                                        pagina += `<img src="images/${tituloSitioWeb}.jpg" class="mx-auto d-block border border-dark" style="height: 10%; width: 20%;" /> <br/>`

    // Botones arriba de la tabla
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

    // Texto descriptivo
    if(tituloSitioWeb == 'Listado de revistas') pagina +=  `<p>Estas son todas las revistas argentinas que se pudieron encontrar en todos los sitios web</p>`
    else                                        pagina +=  `<p>Estas son las revistas argentinas que se encuentran en el sitio web ${tituloSitioWeb}</p>`
            
    // Botones para manejar la tabla
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

    // La tabla
    if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   pagina += armadoDeTabla.armarTablaDeRevistasCasosEspeciales(primeras20Revistas, 1);
    else                                                            pagina += armadoDeTabla.armarTablaDeRevistas(primeras20Revistas, 1);
    

    // Información sobre la tabla
    if(tituloSitioWeb == 'Listado de revistas') pagina += `<p>Cantidad de revistas argentinas: ${cantidadRevistas}</p>`
    else                                        pagina += `<p>Cantidad de revistas en ${tituloSitioWeb}: ${cantidadRevistas}</p>`

    let estadisticasDelArchivo = fs.statSync(`./SGE_Arg/Revistas/${tituloSitioWeb}.json`);
    let fechaUltimaModicacion = estadisticasDelArchivo.mtime;

    // Botón de actualizar tabla y botón de volver
    pagina +=
        `
            <span id="estadoDeLaActualización"></span>

            <p>Última actualización: ${fechaUltimaModicacion.getDate()}/${fechaUltimaModicacion.getMonth()+1}/${fechaUltimaModicacion.getFullYear()} (DD/MM/YY)</p>
            <p><button id="actualizarCatalogo">Actualizar catálogo de revistas</button></p>

            <p><a href="/">Volver</a></p>

            <script src="/javascripts/funcionesClientePlantillaRevista.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

        </body>
    </html>`
    // getMonth() devuelve un valor entre 0 y 11, siendo 0 el mes de Enero; por eso se le suma uno
    // Todas las funciones de JavaScript del lado del cliente estan en la carpeta public/javascripts. Esto es así para ver el código javascript más facilmente y para no mezclar las etiquetas HTML con el JavaScript del cliente

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
                    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/actualizarCatalogo", true); 
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

exports.armarHTML = armarHTML;
exports.armarHTMLvacio = armarHTMLvacio;