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



// Esto es para aquellas sitios web que no distinguen entre ISSN impreso e ISSN electronico. En dichos casos se pone todo en una sola columna. Tampoco brindan información del instituto/editorial de las revistas
// ANDA, PERO AL FINAL SE DECIDIO MOSTRAR AQUELLOS SITIOS WEB QUE NO DISTINGUEN LOS ISSN CON LOS CAMPOS VACIOS
class RevistaEspecial {
    
    constructor(tituloRevista, issn) {
        this.tituloRevista = tituloRevista;
        this.issn          = issn;
    }

    toString() {
        console.log(`Título: ${this.tituloRevista}, ISSN: ${this.issn}`);
    }
}


function crearListadoEspecial(archivoJSON){

    var revistas = [];
    
    for (var i = 0; i < archivoJSON.length; i++)
    {
        if (archivoJSON[i].Título == "HUBO UN ERROR") revistas.push(new RevistaEspecial("HUBO UN ERROR") );
        else                                          revistas.push(new RevistaEspecial(archivoJSON[i].Título, archivoJSON[i]['ISSN']));
    }

    return revistas;
}


function armarTablaDeRevistasCasosEspeciales(arregloRevistas, numeroPagina){

    let tabla = 
    `<table id="tablaRevistas" border="1" class="table table-light table-striped table-bordered">
        <caption>La base de datos de este sitio web no hace diferencia entre ISSN impreso e ISSN electronico. No es posible saber de que tipo de ISSN se trata</caption>
        <thead>
            <tr>
                <th class="text-center">N° Revista</th>
                <th class="text-center">Titulo</th>
                <th class="text-center">ISSN</th>
            </tr>
        </thead>`

    if(numeroPagina > 1) numeroPagina = (numeroPagina * 20) - 19;

    for(let i = 0; i < arregloRevistas.length; i++){
        tabla += `<tr>
                    <td class="text-center">${numeroPagina}</td>
                    <td>${arregloRevistas[i].tituloRevista}</td>
                    <td class="text-center">${arregloRevistas[i].issn}</td>
                 </tr>`
        
        numeroPagina++;
    }

    tabla += `</table>`

    return tabla;
}


exports.crearListado = crearListado;
exports.crearListadoEspecial = crearListadoEspecial;
exports.armarTablaDeRevistas = armarTablaDeRevistas;
exports.armarTablaDeRevistasCasosEspeciales = armarTablaDeRevistasCasosEspeciales;