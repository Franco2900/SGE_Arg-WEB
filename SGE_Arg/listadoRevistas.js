const fs        = require('fs');        // Módulo para leer y escribir archivos
const csvtojson = require('csvtojson')  // Módulo para pasar texto csv a json
const path      = require('path');      // Módulo para trabajar con paths

var archivosJSON = []; // Almaceno los archivo JSON disponibles acá
// Se puede llamar directamente a un archivo JSON local y este será automaticamente parseado para usar inmediatamente

// Me fijo que archivos json estan disponibles
let auxSitiosWeb = ['CAICYT', 'DOAJ', 'Latindex', 'Redalyc', 'Scimago', 'Scielo', 'WoS', 'Biblat', 'Dialnet'];

var archivoCAICYTEncontrado   = false;
var archivoDOAJEncontrado     = false;
var archivoLatindexEncontrado = false;
var archivoRedalycEncontrado  = false;
var archivoScimagoEncontrado  = false;
var archivoScieloEncontrado   = false;
var archivoWoSEncontrado      = false;
var archivoBiblatEncontrado   = false;
var archivoDialnetEncontrado  = false;


for(let i = 0; i < auxSitiosWeb.length; i++)
{
    try {
        archivosJSON.push(require(path.join(__dirname + `/Revistas/${auxSitiosWeb[i]}.json`)) );

        if(auxSitiosWeb[i] == 'CAICYT')     archivoCAICYTEncontrado     = true;
        if(auxSitiosWeb[i] == 'DOAJ')       archivoDOAJEncontrado       = true;
        if(auxSitiosWeb[i] == 'Latindex')   archivoLatindexEncontrado   = true;
        if(auxSitiosWeb[i] == 'Redalyc')    archivoRedalycEncontrado    = true;
        if(auxSitiosWeb[i] == 'Scimago')    archivoScimagoEncontrado    = true;
        if(auxSitiosWeb[i] == 'Scielo')     archivoScieloEncontrado     = true;
        if(auxSitiosWeb[i] == 'WoS')        archivoWoSEncontrado        = true;
        if(auxSitiosWeb[i] == 'Biblat')     archivoBiblatEncontrado     = true;
        if(auxSitiosWeb[i] == 'Dialnet')    archivoDialnetEncontrado    = true;

        console.log(`Sitio web incluido en el listado: ${auxSitiosWeb[i]}`);
    }
    catch (error) {
        archivosJSON.push([])
        console.log(`Hay un problema con el archivo del sitio web ${auxSitiosWeb[i]}`);
        console.log(error);
    }
}

// Clase para pasar el texto de los archivos JSON a objetos y así poder hacer el ordenamiento
class Revista {
    
    constructor(titulo, issnImpreso, issnEnLinea, instituto) {
        this.titulo = titulo;
        this.issnImpreso = issnImpreso;
        this.issnEnLinea = issnEnLinea;
        this.instituto   = instituto;
        
        // Estos atributos son para saber en que sitios web se encuentra la revista
        this.CAICYT      = false;
        this.DOAJ        = false;
        this.Latindex    = false;
        this.Redalyc     = false;
        this.Scimago     = false;
        this.Scielo      = false;
        this.WoS         = false;
        this.Biblat      = false;
        this.Dialnet     = false;
    }

    toString() {
        console.log(`Título: ${this.titulo}, ISSN impreso: ${this.issnImpreso}, ISSN en linea: ${this.issnEnLinea}, Instituto: ${this.instituto}`);
    }
}



// Recorro cada revista de la que hayamos extraido información y creo una lista con el título y el ISSN impreso y/o electronico.
// Una revista puede aparecer en distintos sitios web, por eso se chequea el ISSN para que en la lista solo pueda aparecer una vez cada revista.
function crearListado() {

    try
    {
        var revistas = [];
        var cantidadErrores = 0; // Esta variable me sirve para saber cuantas revistas no aparecen en el listado debido a un error en la extracción de datos

        // Creo una lista inicial poniendo todas las revistas de todos los sitios web en un solo arreglo
        for (var i = 0; i < archivosJSON.length; i++) // for para recorrer todos los sitios web
        {
            for (var j = 0; j < archivosJSON[i].length; j++) // for para recorrer las revistas de cada sitio web
            {
                if (archivosJSON[i][j].Título == "HUBO UN ERROR") cantidadErrores++;
                else                                              revistas.push(new Revista(archivosJSON[i][j].Título, archivosJSON[i][j]['ISSN impresa'], archivosJSON[i][j]['ISSN en linea'], archivosJSON[i][j]['Instituto'])); // Paso el texto a objetos para poder hacer el ordenamiento por alfabeto
            }
        }


        // Ordeno alfabeticamente las revistas según el título.
        revistas.sort(function(A, B){ 

            let comparacion = 0; 
            // Si da 0, son iguales
            // Si da -1, A va antes de B 
            // Si da 1, B va antes de A
    
            if(A.titulo < B.titulo) comparacion = -1;
            if(A.titulo > B.titulo) comparacion = 1;
    
            return comparacion;
        });


        console.log("***********************************************************");
        console.log("Cantidad de revistas a filtrar: " + revistas.length);

        var cantidadRevistasRepetidas = 0;

        // Elimino todas las revistas que tengan lo mismo tanto en el ISSN en linea como en el ISSN impreso, ejemplo: https://www.latindex.org/latindex/Solr/Busqueda?idModBus=0&buscar=Visi%C3%B3n+de+futuro&submit=Buscar
        for (var i = 0; i < revistas.length; i++) 
        {
            if(revistas[i].issnEnLinea == revistas[i].issnImpreso) 
            {
                cantidadRevistasRepetidas++;
                revistas.splice(i, 1);
            }   
        }


        // Elimino las revistas con el mismo ISSN electronico
        for (var i = 0; i < revistas.length; i++) 
        {
            // Agarro un ISSN electronico y lo comparo con el ISSN electronico de todas las demás revistas
            for(var j = 0; j < revistas.length; j++)
            {
                if(i != j && revistas[i].issnEnLinea == revistas[j].issnEnLinea && revistas[i].issnEnLinea != '')   
                {
                    revistas.splice(i, 1); // Elimina un elemento del arreglo si se encuentra repetido
                    cantidadRevistasRepetidas++;
                    if(i != 0) i--;
                }
            }
        }

        // Lo mismo que lo anterior pero esta vez con las ISSN impresas
        for (var i = 0; i < revistas.length; i++) 
        {
            for(var j = 0; j < revistas.length; j++)
            {
                if(i != j && revistas[i].issnImpreso == revistas[j].issnImpreso && revistas[i].issnImpreso != '')   
                {
                    revistas.splice(i, 1); 
                    cantidadRevistasRepetidas++;
                    if(i != 0) i--;
                }
            }
        }


        // Elimino las revistas que tengan el ISSN en linea repetido pero en el campo de ISSN impreso
        for (var i = 0; i < revistas.length; i++)
        {                
            for(var j = 0; j < revistas.length; j++)
            {
                if(i != j && revistas[i].issnEnLinea == revistas[j].issnImpreso && revistas[i].issnEnLinea != '' && revistas[j].issnImpreso != '')   
                {
                    revistas.splice(i, 1); 
                    cantidadRevistasRepetidas++;
                    if(i != 0) i--;
                }
            }       
        }


        // Chequeo en que sitios web esta una revista, fijandome si su ISSN en línea aparece en los distintos archivos JSON 
        //ARREGLAR: Solo sirve si se cargan todos los archivos
        for(var r = 0; r < revistas.length; r++) // Eligo una revista de mi arreglo
        {
            for(var i = 0; i < archivosJSON.length; i++) // Eligo un sitio web / archivo JSON
            {
                for(var j = 0; j < archivosJSON[i].length; j++) // Recorro todas las revistas del sitio web / archivo JSON
                {
                    if(archivosJSON[i][j]['ISSN en linea'] == revistas[r].issnEnLinea) // Si el ISSN electronico de la revista del arreglo y el ISSN electronico de la revista del JSON coinciden, entonces la revista del arreglo se encuentra en dicho sitio web
                    {
                        //console.log(`r:${r} - i:${i} - j:${j} - ${archivosJSON[i][j]['ISSN en linea']} - ${revistas[r].issnEnLinea}`); // DEBUGEO

                        if(i == 0) revistas[r].CAICYT   = true;
                        if(i == 1) revistas[r].DOAJ     = true;
                        if(i == 2) revistas[r].Latindex = true;
                        if(i == 3) revistas[r].Redalyc  = true;
                        if(i == 4) revistas[r].Scimago  = true;
                        if(i == 5) revistas[r].Scielo   = true;
                        if(i == 6) revistas[r].WoS      = true;
                        if(i == 7) revistas[r].Biblat   = true;
                        if(i == 8) revistas[r].Dialnet  = true;
                    }
                    
                }
            }
        }

        // Lo mismo que la anterior pero con los ISSN impresos
        //ARREGLAR: Solo sirve si se cargan todos los archivos
        for(var r = 0; r < revistas.length; r++) 
        {
            for(var i = 0; i < archivosJSON.length; i++) 
            {
                for(var j = 0; j < archivosJSON[i].length; j++) 
                {
                    if(archivosJSON[i][j]['ISSN impresa'] == revistas[r].issnEnLinea)
                    {
                        if(i == 0) revistas[r].CAICYT   = true;
                        if(i == 1) revistas[r].DOAJ     = true;
                        if(i == 2) revistas[r].Latindex = true;
                        if(i == 3) revistas[r].Redalyc  = true;
                        if(i == 4) revistas[r].Scimago  = true;
                        if(i == 5) revistas[r].Scielo   = true;
                        if(i == 6) revistas[r].WoS      = true;
                        if(i == 7) revistas[r].Biblat   = true;
                        if(i == 8) revistas[r].Dialnet  = true;
                    }
                    
                }
            }
        }


        // Este filtro se fija si los datos que proporciono un sitio web están mal o no. Puede darse el caso de que un sitio web de datos equivocados sobre una revista
        // Un ejemplo es la revista de Acta Gastroenterológica Latinoamericana. Sus datos aparecen bien en CAICYT y DOAJ, pero no en Redalyc
        /*
        for (var i = 0; i < revistas.length; i++) // Recorro todas las revistas del arreglo
        {
            //if (typeof revistas[i+1] !== 'undefined' && revistas[i].issnEnLinea != '' && revistas[i+1].issnEnLinea != '') // Si hay una siguiente posición en el arreglo y el issnEnLinea de la revista actual y el de la revista siguiente no son nulos
            if(typeof revistas[i+1] !== 'undefined')
            {
                if(revistas[i].issnImpreso == revistas[i+1].issnEnLinea || revistas[i].issnEnLinea == revistas[i+1].issnImpreso) // Chequeo si los ISSN en linea están invertidos con los ISSN impresos
                {
                    // Si los ISSN están invertidos, arreglo lo de en que sitios web esta la revista
                    if(revistas[i].CAICYT   != revistas[i+1].CAICYT)   revistas[i+1].CAICYT   = true;
                    if(revistas[i].DOAJ     != revistas[i+1].DOAJ)     revistas[i+1].DOAJ     = true;
                    if(revistas[i].Latindex != revistas[i+1].Latindex) revistas[i+1].Latindex = true;
                    if(revistas[i].Redalyc  != revistas[i+1].Redalyc)  revistas[i+1].Redalyc  = true;
                    if(revistas[i].Scimago  != revistas[i+1].Scimago)  revistas[i+1].Scimago  = true;
                    if(revistas[i].Scielo   != revistas[i+1].Scielo)   revistas[i+1].Scielo   = true;
                    if(revistas[i].WoS      != revistas[i+1].WoS)      revistas[i+1].WoS      = true;

                    cantidadRevistasRepetidas++;
                    revistas.splice(i, 1);

                    if(i != 0) i--;
                }
            }
        }
        */



        console.log("***********************************************************");
        console.log("Cantidad de revistas repetidas y eliminadas por el filtro: " + cantidadRevistasRepetidas);
        console.log("Cantidad de revistas que no se añadieron por errores en la extracción de datos: " + cantidadErrores);
        console.log("Cantidad de revistas en el listado final: " + revistas.length);


        // Armo el listado
        // Encabezado
        var listado = "Título;ISSN impresa;ISSN en linea;Instituto/Editorial";
        
        if(archivoCAICYTEncontrado)   listado += ";CAICYT"
        if(archivoDOAJEncontrado)     listado += ";DOAJ"
        if(archivoLatindexEncontrado) listado += ";Latindex"
        if(archivoRedalycEncontrado)  listado += ";Redalyc"
        if(archivoScimagoEncontrado)  listado += ";Scimago"
        if(archivoScieloEncontrado)   listado += ";Scielo"
        if(archivoWoSEncontrado)      listado += ";WoS"
        if(archivoBiblatEncontrado)   listado += ";Biblat"
        if(archivoDialnetEncontrado)  listado += ";Dialnet"
        
        listado += "\n";

        // Cuerpo
        for (var i = 0; i < revistas.length; i++) 
        {
            // Los datos de la revista: Titulo, ISSN impreso, ISSN en línea, Instituto
            listado += `${revistas[i].titulo};${revistas[i].issnImpreso};${revistas[i].issnEnLinea};${revistas[i].instituto}`
        
            // Si dicha revista fue encontrada o no en un sitio web
            if(archivoCAICYTEncontrado)   listado += `;${revistas[i].CAICYT}`
            if(archivoDOAJEncontrado)     listado += `;${revistas[i].DOAJ}`
            if(archivoLatindexEncontrado) listado += `;${revistas[i].Latindex}`
            if(archivoRedalycEncontrado)  listado += `;${revistas[i].Redalyc}`
            if(archivoScimagoEncontrado)  listado += `;${revistas[i].Scimago}`
            if(archivoScieloEncontrado)   listado += `;${revistas[i].Scielo}`
            if(archivoWoSEncontrado)      listado += `;${revistas[i].WoS}`
            if(archivoBiblatEncontrado)   listado += `;${revistas[i].Biblat}`
            if(archivoDialnetEncontrado)  listado += `;${revistas[i].Dialnet}`
        
            listado += "\n";
        }



        // Escribo la info en el archivo .csv
        fs.writeFileSync(path.join(__dirname, './Revistas/Listado de revistas.csv'), listado, { flag: 'w' }, error => {
            if (error) console.log(error);
        })


        // Parseo de CSV a JSON
        setTimeout(function () { // Le indico al programa que espere 5 segundos antes de seguir porque tarda en crearse el archivo .csv
        
            csvtojson({ delimiter: [";"], }).fromFile(path.join(__dirname, './Revistas/Listado de revistas.csv')).then((json) => // La propiedad delimiter indica porque caracter debe separar
            {
                fs.writeFileSync(path.join(__dirname, './Revistas/Listado de revistas.json'), JSON.stringify(json), error => {
                    if (error) console.log(error);
                })
            })
            
        }, 3000);
    
    }
    catch(error)
    {
        console.log(error);
    }

}

exports.crearListado = crearListado;