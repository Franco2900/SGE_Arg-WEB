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
    `<table id="tablaRevistas" border="1">
        <thead>
            <tr>
                <th>N° Revista</th>
                <th>Titulo</th>
                <th>ISSN impreso</th>
                <th>ISSN electronico</th>
                <th>Instituto/Editorial</th>
            </tr>
        </thead>`

    if(numeroPagina > 1) numeroPagina = (numeroPagina * 20) - 19;

    for(let i = 0; i < arregloRevistas.length; i++){
        tabla += `<tr>
                    <td style="text-align: center;">${numeroPagina}</td>
                    <td>${arregloRevistas[i].tituloRevista}</td>
                    <td style="text-align: center;">${arregloRevistas[i].issnImpreso}</td>
                    <td style="text-align: center;">${arregloRevistas[i].issnEnLinea}</td>
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
        </head>
        <body class='fondoClaro'>
            <h1 style="text-align: center;">${tituloSitioWeb}</h1>

            <button id="botonCambiarFondo">Modo claro</button>
            <button id="botonDescargarCSV"><a href="http://localhost:3000/api/descargarCSV?archivoCSV=${tituloSitioWeb}">Descargar CSV</a></button>
            <button id="botonDescargarJSON"><a href="http://localhost:3000/api/descargarJSON?archivoJSON=${tituloSitioWeb}">Descargar JSON</a></button>

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
        `

    if(tituloSitioWeb == 'Listado de revistas')
    {
        pagina +=  `<p>Estas son todas las revistas argentinas que se pudieron encontrar</p>
                    <p>Cantidad de revistas argentinas: ${cantidadRevistas}</p>`
    }
    else
    {
        pagina +=  `<p>Estas son las revistas argentinas que se encuentran en el sitio web ${tituloSitioWeb}</p>
                    <p>Cantidad de revistas en ${tituloSitioWeb}: ${cantidadRevistas}</p>`
    }
            
    pagina += armarTablaDeRevistas(primeras20Revistas, 1);

    pagina +=
            `<p>Página <span id="paginaActual">1</span> de ${cantidaPaginas}</p>

            <button id="botonAnterior">Anterior</button>
            <button id="botonSiguiente">Siguiente</button>

            <script>
                let paginaActual   = Number(document.getElementById("paginaActual").innerText);

                document.getElementById("botonAnterior").addEventListener("click", function(){

                    const xhttp = new XMLHttpRequest();    
                    xhttp.open("POST", "http://localhost:3000/api/paginaAnterior", true); 
                    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    
                    xhttp.onreadystatechange = function() 
                    {         
                        if (this.readyState == 4 && this.status == 200)
                        {
                            if(this.response != '') {

                                document.getElementById("tablaRevistas").innerHTML = this.response;
                                
                                paginaActual--;
                                document.getElementById("paginaActual").innerText = paginaActual;
                            }
                        }
                    };

                    let body = JSON.stringify({tituloSitioWeb: "${tituloSitioWeb}", paginaActual: paginaActual});
                    xhttp.send(body);
                });


                document.getElementById("botonSiguiente").addEventListener("click", function(){

                    const xhttp = new XMLHttpRequest();    
                    xhttp.open("POST", "http://localhost:3000/api/paginaSiguiente", true); 
                    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    
                    xhttp.onreadystatechange = function() 
                    {         
                        if (this.readyState == 4 && this.status == 200)
                        {
                            if(this.response != '') {

                                document.getElementById("tablaRevistas").innerHTML = this.response;
                                
                                paginaActual++;
                                document.getElementById("paginaActual").innerText = paginaActual;
                            }
                        }
                    };

                    let body = JSON.stringify({tituloSitioWeb: "${tituloSitioWeb}", paginaActual: paginaActual});
                    xhttp.send(body);
                });
            </script>


            <p><button id="actualizarCatalogo">Actualizar catálogo de revistas</button></p>

            <script>
                document.getElementById("actualizarCatalogo").addEventListener("click", function(){

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

                    let body = JSON.stringify({tituloSitioWeb: "${tituloSitioWeb}"});
                    xhttp.send(body);
                })
            </script>


            <p><a href="/">Volver</a></p>
        </body>
    </html>`
 
    return pagina;
}


function armarHTMLvacio(tituloSitioWeb){

    let pagina = 
    `<!DOCTYPE html>
    <html>
        <head>
            <title id="titulo">${tituloSitioWeb}</title>
        </head>
        <body>
            <h1 style="text-align: center;">${tituloSitioWeb}</h1>
    `
            if(tituloSitioWeb == 'Listado de revistas')
            {
                pagina += `<p>Todavía no esta armado el listado de revistas</p>`
            }
            else
            {
                pagina += `<p>No hay datos disponibles sobre la revista ${tituloSitioWeb}</p> `
            }

    `    
            <p>Seleccione la opción 'Actualizar catálogo de revistas' para obtener datos</p>
            <p><button id="actualizarCatalogo">Actualizar catálogo de revistas</button></p>

            <script>
                document.getElementById("actualizarCatalogo").addEventListener("click", function(){

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

                    let body = JSON.stringify({tituloSitioWeb: "${tituloSitioWeb}"});
                    xhttp.send(body);
                })
            </script>

            <p><a href="/">Volver</a></p>
        </body>
    </html>
    `;

    return pagina;
}

exports.crearListado = crearListado;
exports.armarTablaDeRevistas = armarTablaDeRevistas;
exports.armarHTML = armarHTML;
exports.armarHTMLvacio = armarHTMLvacio;