const fs   = require('fs');
const path = require('path'); // Módulo para trabajar con rutas

function calcular(tituloSitioWeb)
{
    let tiempoPromedio = 0;

    fs.readFile(path.join(__dirname + `/../SGE_Arg/Tiempos/${tituloSitioWeb}Tiempo.txt`), (error, datos) => { 
        if(error) console.log(error)
        else 
        {
            let tiempos = datos.toString().split(';'); // Separo los tiempos
            

            for(let i = 0; i < tiempos.length; i++)
            {
                if(i == tiempos.length-1) tiempos.splice(i, 1); // La última posición siempre esta vacia
                else
                {
                    tiempos[i] = parseInt(tiempos[i]);
                    tiempoPromedio += tiempos[i];
                }
            }

            tiempoPromedio = Math.ceil(tiempoPromedio / tiempos.length);
            console.log(`El tiempo promedio de actualización para la revista ${tituloSitioWeb} es ${tiempoPromedio}`);

            // Escribo en un archivo json el resultado final
            fs.writeFile(path.join(__dirname, `../SGE_Arg/Tiempos/${tituloSitioWeb}TiempoPromedio.json`), `[{"TiempoPromedio":${tiempoPromedio}}]`, error => 
            { 
                if(error) console.log(error);
            })
        }
    });

}

exports.calcular = calcular;