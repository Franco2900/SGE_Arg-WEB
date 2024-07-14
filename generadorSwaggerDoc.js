const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000/api',
  schemes: ['http'],
};

const outputFile = './swaggerDoc.json';
const routes = ['./routes/api.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);