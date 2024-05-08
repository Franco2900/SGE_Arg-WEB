// Llama a los módulos que se necesitan
var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
const bodyParser = require('body-parser') // Módulo para trabajar con las solicitudes POST

var app = express(); // Creo una aplicación express


// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views')); // Indico en que path esta la carpeta de vistas
app.set('view engine', 'hbs');                   // Indico que motor de vistas se va a usar


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "/public/images")));           // Indico en que path esta la carpeta de imágenes
app.use("/revista/images", express.static(path.join(__dirname, "/public/images"))); 
//app.use("/revista/Listado de revistas/images", express.static(path.join(__dirname, "/public/images"))); // NO SE PORQUE HAY UN PROBLEMA CON LA IMAGEN DE LISTADO DE REVISTAS

app.use("/javascripts", express.static(path.join(__dirname, "/public/javascripts"))); // Indico en que path esta la carpeta de archivos javascripts de lado del cliente
app.use("/stylesheets", express.static(path.join(__dirname, "/public/stylesheets"))); // Indico en que path esta la carpeta de hojas de estilo

// Indicamos que en dicha url use dicho archivo
app.use('/', require('./routes/index') );     
app.use('/users', require('./routes/users') );
app.use('/revista', require('./routes/rutasRevistas') );

app.use('/funcionesServidor', require('./routes/funcionesServidor'));
app.use('/funcionesServidorPlantillaRevista', require('./routes/funcionesServidorPlantillaRevista') );

// Atrapa el error 404 (página no encontrada) y lo maneja
app.use(function(req, res, next) {
  next(createError(404));
});


// Manejador de errores
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
