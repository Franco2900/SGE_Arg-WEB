var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser') // Módulo para trabajar con las solicitudes POST
const fs = require('fs');                 // Módulo para trabajar con archivos locales
const path = require('path');             // Módulo para trabajar con paths
const chokidar = require('chokidar');     // Módulo para poder detectar la creación de archivos

const plantilla = require('./plantillaRevista.js')

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES POST
/*****************************************************************************************************************************/

router.post('/paginaSiguiente', function(req, res){
    
    try
    {
        let datos = '';

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        let revistas         = plantilla.crearListado(archivoJSON);
        let cantidadRevistas = archivoJSON.length;
        let cantidaPaginas   = Math.ceil(cantidadRevistas / 20);

        let paginaActual = req.body.paginaActual;
        let paginaSiguiente = paginaActual + 1;

        if(paginaActual < cantidaPaginas){

            let las20RevistasDelaPagina = [];

            for(let i = paginaActual * 20; i < paginaSiguiente * 20; i++)
            {
                if(i == revistas.length)  i = paginaSiguiente * 20;
                else                      las20RevistasDelaPagina.push(revistas[i]);
            }

            datos = plantilla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaSiguiente);
        }

        res.send(datos);
    }
    catch(error)
    {
        console.log(error);
    }

});


router.post('/paginaAnterior', function(req, res){
    
    try
    {
        let datos = '';

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        let revistas         = plantilla.crearListado(archivoJSON);

        let paginaActual = req.body.paginaActual;
        let paginaAnterior = paginaActual - 1;

        if(paginaActual > 1){

            let las20RevistasDelaPagina = [];

            for(let i = (paginaAnterior-1) * 20; i < paginaAnterior * 20; i++){
                las20RevistasDelaPagina.push(revistas[i]);
            }

            datos = plantilla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaAnterior);
        }

        res.send(datos);
    }
    catch(error)
    {
        console.log(error);
    }

});


router.post('/primeraPagina', function(req, res){

    try
    {
        let datos = '';

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        let revistas         = plantilla.crearListado(archivoJSON);

        let las20RevistasDelaPagina = [];

        for(let i = 0; i < 20; i++)
        {
            if(i == revistas.length)  i = 20;
            else                      las20RevistasDelaPagina.push(revistas[i]);
        }

        datos = plantilla.armarTablaDeRevistas(las20RevistasDelaPagina, 1);

        res.send(datos);
    }
    catch(error)
    {
        console.log(error);
    }

});


router.post('/ultimaPagina', function(req, res){

    try
    {
        let datos = '';

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        let revistas         = plantilla.crearListado(archivoJSON);
        let cantidadRevistas = archivoJSON.length;
        let cantidaPaginas   = Math.ceil(cantidadRevistas / 20);

        let las20RevistasDelaPagina = [];

        for(let i = (cantidaPaginas-1)* 20; i < cantidaPaginas * 20; i++)
        {
            if(i == revistas.length)  i = cantidaPaginas * 20;
            else                      las20RevistasDelaPagina.push(revistas[i]);
        }

        datos = plantilla.armarTablaDeRevistas(las20RevistasDelaPagina, cantidaPaginas);

        res.send(datos);
    }
    catch(error)
    {
        console.log(error);
    }

});


router.post('/buscarPaginaEspecifica', function(req, res){

    try
    {
        let datos = '';

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        let revistas         = plantilla.crearListado(archivoJSON);
        let cantidadRevistas = archivoJSON.length;
        let cantidaPaginas   = Math.ceil(cantidadRevistas / 20);

        let paginaBuscada = Number(req.body.paginaBuscada);
        let las20RevistasDelaPagina = [];

        if(paginaBuscada >= 1 && paginaBuscada <= cantidaPaginas)
        {
            for(let i = (paginaBuscada-1)* 20; i < paginaBuscada * 20; i++)
            {
                if(i == revistas.length)  i = paginaBuscada * 20;
                else                      las20RevistasDelaPagina.push(revistas[i]);
            }

            datos = plantilla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaBuscada);
        }

        res.send(datos);
    }
    catch(error)
    {
        console.log(error);
    }

});


router.post('/actualizarCatalogo', function(req, res){

    try
    {
        let archivoDeExtraccion = "";

        if(req.body.tituloSitioWeb != 'Listado de revistas') 
        {
            archivoDeExtraccion = require(`../SGE_Arg/modulos de extraccion/${req.body.tituloSitioWeb}.js`);
            console.log("Extrayendo datos de la revista " + req.body.tituloSitioWeb);
        }
    
        switch(req.body.tituloSitioWeb){
            case 'CAICYT':
                archivoDeExtraccion.extraerInfoCAICYT();
                break;
            
            case 'Redalyc':
                archivoDeExtraccion.extraerInfoRedalyc();
                break;
            
            case 'Latindex':
                archivoDeExtraccion.extraerInfoLatindexLite();
                break;
            
            case 'DOAJ':
                archivoDeExtraccion.extraerInfoDOAJ();
                break;
    
            case 'WoS':
                archivoDeExtraccion.extraerInfoWoS();
                break;

            case 'Listado de revistas':
                let archivoArmadoDeListado = require('../SGE_Arg/listadoRevistas.js');
                archivoArmadoDeListado.crearListado();
                break;
            
            default:
                console.log('No existe tal archivo');
        }
    }
    catch(error)
    {
        console.log(error);
    }

    
    try// Si el archivo JSON ya existe y solo se actualiza, se ejecuta esto
    { 
        let vigilante = fs.watch(path.join(__dirname, `../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`), function (tipoDeEvento, nombreArchivo){ // Cuando detecta una modificación en el archivo, se ejecuta la función
            
            vigilante.close();

            console.log("Extracción de datos completa");
            res.send();
        });
    }
    catch(error) // Si el archivo JSON no existe y hay que extraer los datos de cero, se ejecuta esto
    {
        let vigilante = chokidar.watch(path.join(__dirname, `../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`) ); // Archivo que le indico que vigile

        vigilante.on('add', function(path) { // Cuando detecta la creación del archivo indicado, se ejecuta la función
            
            vigilante.close();

            console.log("Extracción de datos completa");
            res.send();
        });
    }


});


router.get('/descargarCSV', function(req, res){
    
    res.download(path.join(__dirname, `../SGE_Arg/Revistas/${req.query.archivoCSV}.csv`));
});


router.get('/descargarJSON', function(req, res){
    
    res.download(path.join(__dirname, `../SGE_Arg/Revistas/${req.query.archivoJSON}.json`));
});


module.exports = router;