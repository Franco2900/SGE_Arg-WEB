const fs         = require('fs');        // Módulo para leer y escribir archivos
const puppeteer  = require('puppeteer'); // Módulo para web scrapping
const jsdom      = require('jsdom');     // Módulo para filtrar la información extraida con web scrapping
const csvtojson  = require('csvtojson'); // Módulo para pasar texto csv a json
const chokidar   = require('chokidar');  // Módulo para detectar cambios en un archivo o la creación del mismo
const path       = require('path');      // Módulo para trabajar con rutas

// Busco cuantas páginas devuelve la consulta a Biblat
async function obtenerPaths() {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto('https://biblat.unam.mx/es/');

    // Para consultar las revistas de argentina, se debe indicar tal pais en un componente dinamico
    // Espero a que el selector esté presente en la página
    await page.waitForSelector('path.highcharts-point.highcharts-name-argentina.highcharts-key-ar');
    await page.waitForTimeout(2000);
    // Comprobar si el selector está presente
    const selectorExists = await page.evaluate(() => {
      return !!document.querySelector('path.highcharts-point.highcharts-name-argentina.highcharts-key-ar');
    });

    if (!selectorExists) {
      console.log('El selector no está presente en la página.');
      return [];
    }

    await page.click(
      'path.highcharts-point.highcharts-name-argentina.highcharts-key-ar'
    );
    // Espero a que el selector esté presente en la página
    await page.waitForSelector('div.dataTables_scrollBody');
    await page.waitForTimeout(3000);

    //reviso la tabla de revistas argentina y genero los paths
    const hrefs = await page.evaluate(() => {
      const hrefArray = [];
      const rows = document.querySelectorAll('#bodyRevista tr');

      rows.forEach(row => {
        const hrefElement = row.querySelector('td.sorting_1 a');
        if (hrefElement) {
          const href = hrefElement.getAttribute('href');
          hrefArray.push('https://biblat.unam.mx/es/'+href);
        }
      });

      return hrefArray;
    });
    //console.log('PATHs cantidad obtenidos:', hrefs.length);

    await browser.close();

    return hrefs;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Lanza el error para manejarlo en el contexto que llama a esta función
  }
}


// Busco los enlaces de cada revista que devuelva la consulta a Latindex
async function buscarEnlacesARevistas(paths) {
  try {
    //const paths = await obtenerPaths();
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(5000); // Establece un tiempo de espera predeterminado

    const enlaces = [];

    for (const path of paths) {
      console.log('PATH:', path);
      try {
        await page.goto(path);
        await page.waitForSelector('a.registro.cboxElement', { timeout: 5000 }); // Espera a que aparezca el siguiente enlace
        
        const href = await page.evaluate(() => {
          const aElement = document.querySelector('a.registro.cboxElement');
          return aElement ? aElement.getAttribute('href') : null;
        });

        console.log('Href del siguiente enlace:', href);
        enlaces.push(href);
      } catch (error) {
        console.error('Error en page.goto para el path:', path, error.message);
        // Continúa con el siguiente path si hay un error de tiempo de espera
        //Aqui, deberia almacenar el path para luego reintentar la extraccion
        continue;
      }
    }

    //console.log('ENLACES Cantidad obtenida:', enlaces.length);
    await browser.close();
    return enlaces;
  } catch (error) {
    console.error('Error obteniendo enlaces:', error);
    throw error;
  }
}
// Extraigo la info de una revista
async function extraerInfoRevista(enlaces) {
  const browser = await puppeteer.launch({ headless: "new" });
  const registros = [];

  for (const enlace of enlaces) {
    const page = await browser.newPage();

    try {
      console.log(`Procesando enlace: ${enlace}`);

      const response = await page.goto(enlace); 
      const body     = await response.text();   
            
    const { window: { document } } = new jsdom.JSDOM(body); 
        
    //var filtroHTML  = document.getElementById("rev-linea");
    var filtro2HTML = document.getElementsByClassName("table table-striped ")[0];
    const tabla1    = filtro2HTML.querySelectorAll("tbody tr td");
   var titulo    = null;
   var issn      = null;
   
   for ( i =0; i<tabla1.length;i++){
    //console.log("CONTENIDO: "+tabla1[i].textContent)
     if (tabla1[i].textContent === "Revista:") titulo = tabla1[i+1].textContent ;
     if (tabla1[i].textContent === "ISSN:") issn = tabla1[i+1].textContent ;
    }
    
      //console.log("REGISTROS: "+revista+" "+issn);
      registros.push({ titulo, issn });
    } catch (error) {
      console.error(`Error al procesar enlace: ${enlace}`);
      console.error(error);
      // Continúa con el siguiente path si hay un error de tiempo de espera
      continue;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return registros;
}

// Extraigo la info de todas las revistas de la consulta
async function extraerInfoBiblat() {
  console.log("Comienza la extracción de datos de Biblat");
  const paths = await obtenerPaths();
  const enlaces = await buscarEnlacesARevistas(paths);
  //const enlaces = ['https://biblat.unam.mx/es/revista/salud-colectiva/articulo/concentracion'];
  const registros = await extraerInfoRevista(enlaces);

  console.log("CANTIDAD DE REVISTAS: " + paths.length);
  console.log("REVISTAS CONSULTADAS: " + enlaces.length);
  console.log("REGISTROS OBTENIDOS: " + registros.length);

  // Crear archivo JSON
  /*const jsonFilePath = './Revistas/Biblat.json';
  fs.writeFileSync(jsonFilePath, JSON.stringify(registros, null, 2));
  console.log(`Archivo JSON creado: ${jsonFilePath}`);

  // Crear archivo CSV
  const csvData = registros.map(registro => `${registro.titulo};${registro.issn}`).join('\n');
  const csvFilePath = './Revistas/Biblat.csv';
  fs.writeFileSync(csvFilePath, `Título;ISSN\n${csvData}`);
  console.log(`Archivo CSV creado: ${csvFilePath}`);*/


  // Paso los datos de los objetos a string
  let cantidadRevistasSinISSN = 0;
  let info = "Título;ISSN" + "\n";
  for(let i = 0; i < registros.length; i++){

    if(registros[i].issn != null) {
      info += `${registros[i].titulo};${registros[i].issn}` + "\n"; // Elimino las revistas que no tengan ISSN
    } 
    else{
      cantidadRevistasSinISSN++;
    }
  }

  console.log("Cantidad de revistas eliminadas por no tener ISSN: " + cantidadRevistasSinISSN);

  const jsonFilePath = path.join(__dirname + '/../Revistas/Biblat.json');
  const csvFilePath  = path.join(__dirname + '/../Revistas/Biblat.csv');

  // Con todos los datos en string, escribo la info en formato .csv y después uso el modulo csvtojson para crear el archivo .json
  try
  {
    let vigilante = fs.watch(csvFilePath, function () { // // Se ejecutara cuando detecte un cambio en el archivo (en caso de que si exista el archivo .csv)
      
      csvtojson({delimiter: [";"],}).fromFile(csvFilePath).then((json) => // La propiedad delimiter indica porque caracter debe separar
      { 
        fs.writeFileSync(jsonFilePath, JSON.stringify(json), error => {if(error) console.log(error);})
      })

      vigilante.close();
    });
  }
  catch(error)
  {
    let vigilante = chokidar.watch(csvFilePath); // Archivo que le indico que vigile

    vigilante.on('add', function(path) { // Se ejecutara cuando detecte la creación del archivo (en caso de que no exista el archivo .csv)
    
      csvtojson({delimiter: [";"],}).fromFile(csvFilePath).then((json) =>
      { 
        fs.writeFileSync(jsonFilePath, JSON.stringify(json), error => {if(error) console.log(error);})
      })

      vigilante.close();    // Dejo de vigilar
    });
  }

  fs.writeFileSync(csvFilePath, info); // Escribo el archivo

  console.log("Termina la extracción de datos de Biblat");
}

exports.extraerInfoBiblat = extraerInfoBiblat;
