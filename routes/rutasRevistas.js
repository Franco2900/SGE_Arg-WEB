var express = require('express');
var router = express.Router();

const plantilla = require('./plantillaRevista.js') // Arma el HTML de las revistas

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES GET
/*****************************************************************************************************************************/

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

module.exports = router;
