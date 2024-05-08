var express = require('express');
var router = express.Router();

/**************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES POST
// ACÁ VAN LAS FUNCIONES DEL SERVIDOR QUE SE PUEDEN EJECUTAR SIN IMPORTAR DONDE NOS ENCONTREMOS EN EL SITIO WEB
/**************************************************************************************************************/

router.post('/fondoPantalla', function(req, res){

    console.log("Cambiar a: " + req.body.nuevoFondo);

    try
    {
        res.cookie('fondoPantalla', req.body.nuevoFondo,{ expires: new Date(Date.now() + (1000*60*60)), httpOnly: false }) // Fecha de expiración de la cookie: 1 hora
        res.sendStatus(200); // Por algún motivo, sin el estatus 200 no sirve
    }
    catch(error)
    {
        console.log(error);
    }

});


module.exports = router;