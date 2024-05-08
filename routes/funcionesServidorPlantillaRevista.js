var express = require('express');
var router = express.Router();
const fs = require('fs');                 // Módulo para trabajar con archivos locales
const path = require('path');             // Módulo para trabajar con paths
const chokidar = require('chokidar');     // Módulo para poder detectar la creación de archivos

const armadoDeTabla = require('./armadoDeTabla.js');
const calculadoraTiempoPromedioActualizacion = require('./calculadoraTiempoPromedioActualizacion.js');

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES POST
// ACÁ VAN LAS FUNCIONES DEL SERVIDOR QUE SE PUEDEN EJECUTAR SOLO SI NOS ENCONTRAMOS EN ALGUNA REVISTA DEL SITIO WEB
/*****************************************************************************************************************************/

router.post('/paginaSiguiente', function(req, res){
    
    try
    {
        let datos = '';
        let tituloSitioWeb = req.body.tituloSitioWeb;

        const archivoJSON    = require(`../SGE_Arg/Revistas/${tituloSitioWeb}.json`);
        /*let revistas;
        if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
        else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)*/
        let revistas = armadoDeTabla.crearListado(archivoJSON)

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

            /*if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   datos = armadoDeTabla.armarTablaDeRevistasCasosEspeciales(las20RevistasDelaPagina, paginaSiguiente)
            else                                                            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaSiguiente)*/
            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaSiguiente)
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
        let tituloSitioWeb = req.body.tituloSitioWeb;

        const archivoJSON    = require(`../SGE_Arg/Revistas/${tituloSitioWeb}.json`);
        /*let revistas;
        if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
        else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)*/
        let revistas = armadoDeTabla.crearListado(archivoJSON);

        let paginaActual = req.body.paginaActual;
        let paginaAnterior = paginaActual - 1;

        if(paginaActual > 1){

            let las20RevistasDelaPagina = [];

            for(let i = (paginaAnterior-1) * 20; i < paginaAnterior * 20; i++){
                las20RevistasDelaPagina.push(revistas[i]);
            }

            /*if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   datos = armadoDeTabla.armarTablaDeRevistasCasosEspeciales(las20RevistasDelaPagina, paginaAnterior)
            else                                                            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaAnterior)*/
            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaAnterior)
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
        let tituloSitioWeb = req.body.tituloSitioWeb;

        const archivoJSON    = require(`../SGE_Arg/Revistas/${tituloSitioWeb}.json`);
        /*let revistas;
        if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
        else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)*/
        let revistas = armadoDeTabla.crearListado(archivoJSON);

        let las20RevistasDelaPagina = [];

        for(let i = 0; i < 20; i++)
        {
            if(i == revistas.length)  i = 20;
            else                      las20RevistasDelaPagina.push(revistas[i]);
        }

        /*if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   datos = armadoDeTabla.armarTablaDeRevistasCasosEspeciales(las20RevistasDelaPagina, 1)
        else                                                            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, 1)*/
        datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, 1);

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
        let tituloSitioWeb = req.body.tituloSitioWeb;

        const archivoJSON    = require(`../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`);
        /*let revistas;
        if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
        else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)*/
        let revistas = armadoDeTabla.crearListado(archivoJSON);
        let cantidadRevistas = archivoJSON.length;
        let cantidadPaginas   = Math.ceil(cantidadRevistas / 20);

        let las20RevistasDelaPagina = [];

        for(let i = (cantidadPaginas-1)* 20; i < cantidadPaginas * 20; i++)
        {
            if(i == revistas.length)  i = cantidadPaginas * 20;
            else                      las20RevistasDelaPagina.push(revistas[i]);
        }

        /*if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   datos = armadoDeTabla.armarTablaDeRevistasCasosEspeciales(las20RevistasDelaPagina, cantidadPaginas)
        else                                                            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, cantidadPaginas)*/
        datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, cantidadPaginas);
        
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
        let tituloSitioWeb = req.body.tituloSitioWeb;

        const archivoJSON    = require(`../SGE_Arg/Revistas/${tituloSitioWeb}.json`);

        /*let revistas;
        if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   revistas = armadoDeTabla.crearListadoEspecial(archivoJSON)
        else                                                            revistas = armadoDeTabla.crearListado(archivoJSON)*/
        let revistas = armadoDeTabla.crearListado(archivoJSON);

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

            /*if(tituloSitioWeb == 'Biblat' || tituloSitioWeb == 'Dialnet')   datos = armadoDeTabla.armarTablaDeRevistasCasosEspeciales(las20RevistasDelaPagina, paginaBuscada)
            else                                                            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaBuscada)*/
            datos = armadoDeTabla.armarTablaDeRevistas(las20RevistasDelaPagina, paginaBuscada)
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
                archivoDeExtraccion.extraerInfo();
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

            case 'Scielo':
                archivoDeExtraccion.extraerInfoScielo();
                break;

            case 'Scimago':
                archivoDeExtraccion.extraerInfoScimagojr();
                break;

            case 'Biblat':
                archivoDeExtraccion.extraerInfoBiblat();
                break;

            case 'Listado de revistas':
                let archivoArmadoDeListado = require('../SGE_Arg/listadoRevistas.js');
                archivoArmadoDeListado.crearListado();
                break;
            
            default:
                console.log('No existe tal revista');
        }
        

        let segundos = 0;

        function sumarSegundo(){
            segundos++;
        }
        
        let contadorDeSegundos = setInterval(sumarSegundo, 1000); // Cada 1 segundo se llama a la función sumar segundo


        if(fs.existsSync(path.join(__dirname, `../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`)) ) // Si el archivo JSON ya existe y solo se actualiza, se ejecuta esto
        { 
            let vigilante = fs.watch(path.join(__dirname, `../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`), function (tipoDeEvento, nombreArchivo){ // Cuando detecta una modificación en el archivo, se ejecuta la función
                
                vigilante.close();
                //clearTimeout(timeOut);
    
                console.log("Extracción de datos completa");
                res.send("Actualización exitosa");
    
                // Otra forma de hacerlo
                //if(req.body.tituloSitioWeb == 'Listado de revistas') res.redirect(`/revista/listadoRevistas`);
                //else                                                 res.redirect(`/revista/${req.body.tituloSitioWeb}`);

                clearInterval(contadorDeSegundos); // Paro el contador
                console.log(`Se tardo ${segundos} segundos en extraer los datos`);
                console.log('*************************************')

                fs.appendFile(path.join(__dirname, `../SGE_Arg/Tiempos/${req.body.tituloSitioWeb}Tiempo.txt`), `${segundos};`, error => 
                { 
                    if(error) console.log(error);
                })

                calculadoraTiempoPromedioActualizacion.calcular(req.body.tituloSitioWeb);
            });

            // Si después de 2 minutos todavía no se detecto la creación o modificación de los archivos, se considera que fallo la extracción
            // Anda, pero algunas sitios como CAICYT y Biblat tardan más de 2 minutos en actualizarse
            /*let timeOut = setTimeout(function () { 
                vigilante.close();
                res.send("Actualización fallida");   
            }, 120000);*/

        }
        else // Si el archivo JSON no existe y hay que extraer los datos de cero, se ejecuta esto
        {
            let vigilante = chokidar.watch(path.join(__dirname, `../SGE_Arg/Revistas/${req.body.tituloSitioWeb}.json`) ); // Archivo que le indico que vigile
    
            vigilante.on('add', function(path) { // Cuando detecta la creación del archivo indicado, se ejecuta la función
                
                vigilante.close();
                //clearTimeout(timeOut);
    
                console.log("Extracción de datos completa");
                res.send("Actualización exitosa");
    
                // Otra forma de hacerlo
                //if(req.body.tituloSitioWeb == 'Listado de revistas') res.redirect(`/revista/listadoRevistas`);
                //else                                                 res.redirect(`/revista/${req.body.tituloSitioWeb}`);

                clearInterval(contadorDeSegundos); // Paro el contador
                console.log(`Se tardo ${segundos} segundos en extraer los datos`);

                // Se supone que si no existe el archivo JSON, tampoco existe el archivo con todos los tiempos de extracción
                fs.writeFile(path.join(__dirname, `../SGE_Arg/Tiempos/${req.body.tituloSitioWeb}Tiempo.txt`), `${segundos};`, error => 
                { 
                    if(error) console.log(error);
                })
            });
            
            
            /*let timeOut = setTimeout(function () { 
                vigilante.close();
                res.send("Actualización fallida");   
            }, 120000);*/
        }

        
        /*setTimeout(function () { // Si después de 2 minutos todavía no se detecto la creación o modificación de los archivos, se considera que fallo la extracción
            res.send("Actualización fallida");   
        }, 120000);*/
        // El error de la extracción se maneja así porque los módulos de extracción solo devuelven un console.log() cuando ocurre un error. 
        // Quitar los catch() que tienen los módulos de extracción haría que el programa dejara de funcionar en caso de un error
        // NO ANDA
        // Si hay una actualización exitosa, el servidor envía tambien esta respuesta despues de 2 minutos y se rompe todo. 
        // Esto es porque a cada solicitud al servidor, solo puede haber una respuesta

    }
    catch(error)
    {
        console.log(error);
        res.send("Actualización fallida");
    }

});


router.get('/descargarCSV', function(req, res){
    
    res.download(path.join(__dirname, `../SGE_Arg/Revistas/${req.query.archivoCSV}.csv`));
});


router.get('/descargarJSON', function(req, res){
    
    res.download(path.join(__dirname, `../SGE_Arg/Revistas/${req.query.archivoJSON}.json`));
});


module.exports = router;