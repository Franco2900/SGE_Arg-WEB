const fs        = require('fs');        // Módulo para leer y escribir archivos
const puppeteer = require('puppeteer'); // Módulo para web scrapping
const jsdom     = require('jsdom');     // Módulo para filtrar la información extraida con web scrapping
const csvtojson = require('csvtojson')  // Módulo para pasar texto csv a json
const path      = require('path');      // Módulo para trabajar con los path/rutas (Es un modelo núcleo de Node.js)

// Busco cuantas páginas devuelve la consulta a Latindex (cada página tiene entre 1 y 20 revistas)
async function buscarCantidadPaginas() {

  var cantidadPaginas;
  const browser = await puppeteer.launch({ headless: 'new' }); // inicio puppeter

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);    // Indico el tiempo limite para conectarse a un sitio web en milisegundos. Con cero quita el límite de tiempo (no es recomendable poner en 0 porque puede quedar en un bucle infinito en caso de error)
    const response = await page.goto(`https://www.latindex.org/latindex/bAvanzada/resultado?idMod=1&tema=0&subtema=0&region=0&pais=3&critCat=0&send=Buscar&page=1`); // URL del sitio web al que se le hace web scrapping
    const body = await response.text(); // Guardo el HTML extraido en esta variable  

    const { window: { document } } = new jsdom.JSDOM(body); // inicio JSDOM y le paso el HTML extraido

    const filtroHTML = document.querySelectorAll('nav ul li a');              // Hago un filtro al HTML extraido
    cantidadPaginas = parseInt(filtroHTML[filtroHTML.length - 2].textContent); // Extraigo la información que quiero del filtro

    console.log("CANTIDAD DE PÁGINAS: " + cantidadPaginas);
  }
  catch (error) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("HUBO UN ERROR CON LA CONEXIÓN DE PUPPETEER");
    console.error(error);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  await browser.close(); // cierro puppeter
  return cantidadPaginas;
}


// Busco los enlaces de cada revista que devuelva la consulta a Latindex
async function buscarEnlacesARevistas() {

  var enlaces = [];
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    var paginaActual = 1;
    const cantidadPaginas = await buscarCantidadPaginas(puppeteer, jsdom);
    
    while (paginaActual <= cantidadPaginas) {
      console.log(`Obteniendo enlaces de la página ${paginaActual}`);

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(120000);
      const response = await page.goto(`https://www.latindex.org/latindex/bAvanzada/resultado?idMod=1&tema=0&subtema=0&region=0&pais=3&critCat=0&send=Buscar&page=${paginaActual}`);
      const body = await response.text();

      const { window: { document } } = new jsdom.JSDOM(body);

      const filtroHTML = document.querySelectorAll('div table tbody tr td div a');

      filtroHTML.forEach(element => {
        enlaces.push(element.getAttribute("href"));
      });

      paginaActual++;
    }
  }
  catch (error) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("HUBO UN ERROR CON LA CONEXIÓN DE PUPPETEER");
    console.error(error);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  await browser.close();
  return enlaces;
}


// Extraigo la info de una revista
async function extraerInfoRevista(enlace) {
  var respuesta;
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const page     = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
    const response = await page.goto(enlace);
    const body     = await response.text();

    const { window: { document } } = new jsdom.JSDOM(body);

    try {
      const tabla1      = document.getElementById("rev-linea").getElementsByClassName("table-resultadosFicha")[0].querySelectorAll("tbody tr td");
      const titulo      = tabla1[0].textContent;
      const issnEnLinea = tabla1[tabla1.length - 1].textContent;

      const tabla2 = document.getElementById("datos-comunes").querySelectorAll("div table tbody tr td");
      const tabla3 = document.getElementById("datos-comunes").querySelectorAll("div table tbody tr th");

      var moverPosicion = 0;
      var organismoResponsable = null;
      if (tabla3[3].textContent == "Organismo responsable:") // No todas las revistas tienen esta variable
      {
        moverPosicion = 1;
        organismoResponsable = tabla2[3].textContent.trim().replaceAll(";", ",");
      }

      const idioma    = tabla2[0].textContent.trim().replaceAll(";", ",");
      const tema      = tabla2[1].textContent.trim().replaceAll(";", ",");
      const subtemas  = tabla2[2].textContent.trim().replaceAll(";", ",");
      const editorial = tabla2[3 + moverPosicion].textContent.trim().replaceAll(";", ",");
      const ciudad    = tabla2[4 + moverPosicion].textContent.trim().replaceAll(";", ",");
      const provincia = tabla2[5 + moverPosicion].textContent.trim().replaceAll(";", ","); // En Latindex se llama Estado/Provincia/Departamento pero para hacerlo corto lo llamo directamente provincia
      const correo    = tabla2[6 + moverPosicion].textContent.trim().replaceAll(";", ",");

      // Muestro en consola los resultados
      console.log(`***********************************************************************************`);
      console.log(`Título: ${titulo}`);
      console.log(`ISSN en linea: ${issnEnLinea}`);
      console.log(`Idioma: ${idioma}`);
      console.log(`Tema: ${tema}`);
      console.log(`Subtemas: ${subtemas}`);
      console.log(`Organismo responsable: ${organismoResponsable}`);
      console.log(`Editorial: ${editorial}`);
      console.log(`Ciudad: ${ciudad}`);
      console.log(`Estado/Provincia/Departamento: ${provincia}`);
      console.log(`Correo: ${correo}`);
      console.log(`***********************************************************************************`);

      respuesta = `${titulo};${issnEnLinea};${idioma};${tema};${subtemas};${organismoResponsable};${editorial};${ciudad};${provincia};${correo}` + `\n`;
    }
    catch (error) {
      respuesta = "HUBO UN ERROR AL EXTRAER LOS DATOS" + "\n";

      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log("HUBO UN ERROR AL EXTRAER LOS DATOS");
      console.error(error);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    }

  }
  catch (error) {
    respuesta = "HUBO UN ERROR CON LA CONEXIÓN DE PUPPETEER" + "\n";

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("HUBO UN ERROR CON LA CONEXIÓN DE PUPPETEER");
    console.error(error);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  await browser.close();
  return respuesta;
}


// Extraigo la info de todas las revistas de la consulta
async function extraerInfoLatindex() {
  console.log("Comienza la extracción de datos de Latindex");

  const enlaces = await buscarEnlacesARevistas();
  var info = "Título;ISSN en linea;Idioma;Tema;Subtemas;Organismo responsable;Editorial;Ciudad;Estado/Provincia/Departamento;Correo" + "\n";

  console.log("CANTIDAD DE REVISTAS: " + enlaces.length);

  var revista = 0;
  for (var i = 0; i < enlaces.length; i++) {
    console.log(`REVISTA ${++revista}`);
    info += await extraerInfoRevista(enlaces[i]);
  }

  fs.writeFile('./Revistas/Latindex.csv', info, error => {
    if (error) console.log(error);
  })

  setTimeout(function () { // Le indico al programa que espere 5 segundos antes de seguir porque tarda en crearse el archivo .csv

    // Parseo de CSV a JSON
    csvtojson({ delimiter: [";"], }).fromFile('./Revistas/Latindex.csv').then((json) => // La propiedad delimiter indica porque caracter debe separar
    {
      fs.writeFile('./Revistas/Latindex.json', JSON.stringify(json), error => {
        if (error) console.log(error);
      })
    })

  }, 5000);

  console.log("Termina la extracción de datos de Latindex");
}


exports.extraerInfoLatindex = extraerInfoLatindex;


// Se utiliza la función de descargar documentos de Latindex, esto es lo más cercano a una API que tiene el sitio web.
async function extraerInfoLatindexLite() {

  console.log("Iniciado extracción de datos de Latindex");
  const browser = await puppeteer.launch({ headless: 'new' }); // inicio puppeter

  try {
    var page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);    // Indico el tiempo limite para conectarse a un sitio web en milisegundos. Con cero quita el límite de tiempo (no es recomendable poner en 0 porque puede quedar en un bucle infinito en caso de error)
    await page.goto(`https://www.latindex.org/latindex/bAvanzada/resultado?idMod=1&tema=0&subtema=0&region=0&pais=3&critCat=0&send=Buscar&page=1`); // URL del sitio web al que se accede

    await page._client().send('Page.setDownloadBehavior',
    {
      behavior: 'allow',                        // Permito la descarga de archivos
      downloadPath: path.resolve('./Revistas'), // Indico donde quiero descargar el archivo. La función resolve() transforma path relativos en path absolutos
    });

    await page.click('a.export-links[data-href*="https://www.latindex.org/latindex/exportar/busquedaAvanzada/json"]'); // Indico donde hacer click

    console.log("Solicitando datos a Latindex");
    await page._client().on('Page.downloadProgress', e => {
      if (e.state === 'completed') console.log("Solicitud completa. Procesando información"); // Le indico que si el estado de la descarga es completado, que muestre el mensaje
    });


    setTimeout(function () { // Le indico al programa que espere 10 segundos antes de seguir porque cuando se descarga algo primero se crea un archivo temporal y luego obtenemos el archivo descargado. Solo con la confirmación de descarga completada de parte del navegador no alcanza
      try {
        const archivoDescargado = require(path.resolve('./Revistas/Busqueda_avanzada.json'));


        var info = "Título;ISSN en linea;ISSN impresa;ISSN-L;Instituto" + "\n";
        for (var i = 0; i < archivoDescargado.length; i++) {
          info += `${archivoDescargado[i].tit_propio};${archivoDescargado[i].issn_e};${archivoDescargado[i].issn_imp};${archivoDescargado[i].issn_l};${archivoDescargado[i].nombre_edi.replaceAll(";", ",")}` + `\n`;
        }

        // Escribo la info en formato csv. En caso de que ya exista el archivo, lo reescribe así tenemos siempre la información actualizada
        fs.writeFile('./Revistas/Latindex.csv', info, error => {
          if (error) console.log(error);
        })


        setTimeout(function () {

          // Parseo de CSV a JSON
          csvtojson({ delimiter: [";"], }).fromFile('./Revistas/Latindex.csv').then((json) => // La propiedad delimiter indica porque caracter debe separar
          {
            fs.writeFile('./Revistas/Latindex.json', JSON.stringify(json), error => {
              if (error) console.log(error);
            })
          })

        }, 5000);


        // Elimino el archivo que descargue de Latindex
        fs.unlink(path.resolve('./Revistas/Busqueda_avanzada.json'), (error) => {
          if (error) return console.log(error);
        });

        console.log("Termina la extracción de datos de Latindex");
      }
      catch (error) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log("HUBO UN ERROR CON EL ARCHIVO DESCARGADO");
        console.error(error);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      }

    }, 10000);

  }
  catch (error) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("HUBO UN ERROR CON LA CONEXIÓN DE PUPPETEER");
    console.error(error);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  setTimeout(function () { // Al ser una función asincrona, el resto del código después del setTimeout de arriba se sigue ejecutando y lo que esta dentro de dicho setTimeout se ejecuta después de pasado el tiempo indicado
    browser.close();       // Es por eso que hay que hacer también un setTimeout con el browser.close() para que el archivo se pueda descargar
  }, 10000);

}

exports.extraerInfoLatindexLite = extraerInfoLatindexLite;
