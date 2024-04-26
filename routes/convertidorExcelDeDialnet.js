const xlsx       = require('xlsx');       // Módulo para trabajar con archivos excel
const fs         = require('fs');         // Módulo para poder leer y escribir archivos
const path       = require('path');       // Módulo para trabajar con rutas
const csvtojson  = require('csvtojson');  // Módulo para pasar texto csv a json

const chokidar = require('chokidar');

function convertir(nombreExcel)
{
  const workBook = xlsx.readFile(path.join(__dirname + `/${nombreExcel}`) ); // xlsx.readFile usa fs.readFileSync
  xlsx.writeFile(workBook, path.join(__dirname + '/Revistas Dialnet.csv'), { bookType: "csv" });      // Paso el contenido en formato .xlsx a otro archivo en formato .csv

  // Modifico la información para quedarme solo con lo que quiero
  let contenido = fs.readFileSync(path.join(__dirname + '/Revistas Dialnet.csv'), 'utf-8');
  let lineas    = contenido.split('\n');  // Separo el contenido del archivo en lineas

  if(lineas[0].includes('CODIGO,')) lineas[0] = lineas[0].replace('CODIGO,', '');
  if(lineas[0].includes('TITULO,')) lineas[0] = lineas[0].replace('TITULO,', 'Título');
  if(lineas[0].includes('PAIS,'))   lineas[0] = lineas[0].replace('PAIS,', ';');
  if(lineas[0].includes('ISSN'))    lineas[0] = lineas[0].replace('ISSN', 'ISSN impresa');
  lineas[0] += ';ISSN en linea;Instituto;URL';

  for(let i = 1; i < lineas.length; i++) // Recorre todas las lineas
  { 
    for(let j = 0; j < lineas[i].length; j++) // Recorre todos los caracteres de una linea
    {
        if(isNaN(lineas[i][j])) // Elimino el campo código
        {
            //lineas[i] = lineas[i].substring(0, j) + ';' + lineas[i].substring(j+1, lineas[i].length);
            lineas[i] = lineas[i].substring(j+1, lineas[i].length) + ";;;" + "https://dialnet.unirioja.es/servlet/revista?codigo=" + lineas[i].substring(0, j);
            break;
        } 
    }

    if(lineas[i].includes(',ARG-Argentina,')) lineas[i] = lineas[i].replace(',ARG-Argentina,', ';'); // Elimino el campo país
  }


  // Con todos los datos en string, escribo la info en formato .csv y después uso el modulo csvtojson para crear el archivo .json
  let info = '';
  for(let i = 0; i < lineas.length; i++) 
  {
    if(!lineas[i].includes(';;;;') ) info += `${lineas[i]}\n`; // Algunas revistas no tienen ISSN, así que elimino dichas revistas
  }

  const csvFilePath  = path.join(__dirname + '/../SGE_Arg/Revistas/Dialnet.csv');
  const jsonFilePath = path.join(__dirname + '/../SGE_Arg/Revistas/Dialnet.json');

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

  fs.writeFileSync(csvFilePath, info);
  fs.unlinkSync(path.join(__dirname + '/Revistas Dialnet.csv') ); // Elimino el archivo para que no ocupe espacio
  fs.unlinkSync(path.join(__dirname + `/${nombreExcel}`) );       // También elimino el archivo subido de Dialnet para evitar un garron legal

  // DEBUG
  for(let i = 0; i < lineas.length; i++){ 
      console.log(lineas[i]);
  }

}

exports.convertir = convertir;