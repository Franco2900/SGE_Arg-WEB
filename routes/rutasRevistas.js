var express = require('express');
var router = express.Router();

const multer = require('multer');   // Módulo para subir archivos desde cliente al servidor
let nombreArchivoExcelDialnet = '';
const storage = multer.diskStorage({
    
    destination: function(req, file, cb){ // Lugar donde se guarda el archivo subido
        cb(null, `${__dirname}`);
    },

    filename: function(req, file, cb){ // Nombre con el que se guarda el archivo subido
        nombreArchivoExcelDialnet = file.originalname;
        cb(null, file.originalname);
    }

})
const subida = multer({ storage }); // Objeto que se encarga de la subida de los archivos

const chokidar = require('chokidar');

const plantilla               = require('./plantillaRevista.js'); // Arma el HTML de las revistas
const convertirExcelDeDialnet = require('./convertidorExcelDeDialnet.js');

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES GET
/*****************************************************************************************************************************/

//let listaDeRevistas = ['CAICYT', 'Latindex', 'DOAJ', 'Redalyc', 'Biblat', 'Scimago', 'Scielo', 'WoS', 'Dialnet', 'Listado de revistas'];

// RUTAS DINAMICAS
router.get('/:revista', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML(req.params.revista, req.cookies);
        res.send(pagina);
    }
    catch(error){
        console.log(error);
        let pagina = plantilla.armarHTMLvacio(req.params.revista);
        res.send(pagina);
    }
    
});



router.post('/subirExcelDialnet', subida.single('excelDialnet'), function(req, res, next) {

    var watcher = chokidar.watch(__dirname + `/${nombreArchivoExcelDialnet}`); // Archivo que le indico que vigile

    watcher.on('add', function(archivoSubido) { // Ejecuta esta función cuando detecta la creación del archivo
    
        console.log('El archivo ' + archivoSubido + ' ha sido subido');
        convertirExcelDeDialnet.convertir(nombreArchivoExcelDialnet);

        watcher.close();    // Dejo de vigilar
    });

    res.send(`<p>Archivo ${nombreArchivoExcelDialnet} subido exitosamente<p>
              <p><a href="/">Volver</a></p>`);
});


// RUTAS HARDCODEADAS
/*
// Las rutas no son sensibles a las mayusculas y minusculas, por lo que se las puede llamar más facilmente

router.get('/caicyt', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('CAICYT');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('CAICYT');
        res.send(pagina);
    }
    
});


router.get('/latindex', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Latindex');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Latindex');
        res.send(pagina);
    }
});


router.get('/doaj', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('DOAJ');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('DOAJ');
        res.send(pagina);
    }
});


router.get('/redalyc', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Redalyc');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Redalyc');
        res.send(pagina);
    }
});


router.get('/biblat', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Biblat');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Biblat');
        res.send(pagina);
    }
});



router.get('/Scimago', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Scimago');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Scimago');
        res.send(pagina);
    }
});



router.get('/scielo', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Scielo');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Scielo');
        res.send(pagina);
    }
});



router.get('/WoS', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('WoS');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('WoS');
        res.send(pagina);
    }
});



router.get('/dialnet', function(req, res, next) {

    try{
        let pagina = plantilla.armarHTML('Dialnet');
        res.send(pagina);
    }
    catch(error){
        let pagina = plantilla.armarHTMLvacio('Dialnet');
        res.send(pagina);
    }
});



router.get('/listadoRevistas', function(req, res, next) {

    try
    {
        let pagina = plantilla.armarHTML('Listado de revistas');
        res.send(pagina);
    }
    catch(error)
    {
        let pagina = plantilla.armarHTMLvacio('Listado de revistas');
        res.send(pagina);
    }

});
*/

module.exports = router;
