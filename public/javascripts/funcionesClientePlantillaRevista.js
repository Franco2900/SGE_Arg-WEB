let botonCambiarFondo = document.getElementById("botonCambiarFondo");
                
botonCambiarFondo.addEventListener("click", function(){
                    
    if(botonCambiarFondo.innerText == "Modo claro") 
    {
        document.getElementsByTagName("body")[0].classList.remove('fondoClaro');
        document.getElementsByTagName("body")[0].classList.add('fondoOscuro');

        botonCambiarFondo.innerText = "Modo oscuro";
        botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb-off');

        document.getElementById("tablaRevistas").setAttribute('class', 'table table-dark table-striped table-bordered');
    }
    else 
    {
        document.getElementsByTagName("body")[0].classList.remove('fondoOscuro');
        document.getElementsByTagName("body")[0].classList.add('fondoClaro');

        botonCambiarFondo.innerText = "Modo claro";
        botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb');

        document.getElementById("tablaRevistas").setAttribute('class', 'table table-light table-striped table-bordered');
    }
                    
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("buscarPaginaEspecifica").addEventListener("change", function(){

    let tituloSitioWeb = document.getElementById("titulo").innerText;
    let paginaBuscada = Number(document.getElementById("buscarPaginaEspecifica").value);

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/buscarPaginaEspecifica", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            if(this.response != '') 
            {
                document.getElementById("tablaRevistas").innerHTML = this.response;
                
                document.getElementById("paginaActual").innerText = paginaBuscada;
            }
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb, paginaBuscada: paginaBuscada});
    xhttp.send(body);
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("botonAnterior").addEventListener("click", function(){

    let tituloSitioWeb = document.getElementById("titulo").innerText;
    let paginaActual   = Number(document.getElementById("paginaActual").innerText);

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/paginaAnterior", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            if(this.response != '') {

                document.getElementById("tablaRevistas").innerHTML = this.response;
                
                paginaActual--;
                document.getElementById("paginaActual").innerText = paginaActual;
            }
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb, paginaActual: paginaActual});
    xhttp.send(body);
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("botonSiguiente").addEventListener("click", function(){

    let tituloSitioWeb = document.getElementById("titulo").innerText;
    let paginaActual   = Number(document.getElementById("paginaActual").innerText);

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/paginaSiguiente", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            if(this.response != '') {

                document.getElementById("tablaRevistas").innerHTML = this.response;
                
                paginaActual++;
                document.getElementById("paginaActual").innerText = paginaActual;
            }
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb, paginaActual: paginaActual});
    xhttp.send(body);
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("botonPrimeraPagina").addEventListener("click", function(){
                    
    let tituloSitioWeb = document.getElementById("titulo").innerText;

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/primeraPagina", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            if(this.response != '') {

                document.getElementById("tablaRevistas").innerHTML = this.response;
                
                document.getElementById("paginaActual").innerText = 1;
            }
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb});
    xhttp.send(body);
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("botonUltimaPagina").addEventListener("click", function(){

    let tituloSitioWeb = document.getElementById("titulo").innerText;
    let cantidaPaginas = Number(document.getElementById("cantidaPaginas").innerText);

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/ultimaPagina", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            if(this.response != '') {

                document.getElementById("tablaRevistas").innerHTML = this.response;
                
                document.getElementById("paginaActual").innerText = cantidaPaginas;
            }
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb});
    xhttp.send(body);
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("actualizarCatalogo").addEventListener("click", function(){

    // Muestro el gif de reloj
    let estadoDeLaActualización = document.getElementById('estadoDeLaActualización');
    estadoDeLaActualización.innerHTML = `<img src="../images/esperando.gif" class="mx-auto d-block border border-dark" />
                                         <h2 style="text-align: center;">Actualizando datos. Espere por favor</h2>`;

    document.getElementById("actualizarCatalogo").style.display="none"; // Hago invisible el boton de actualizar

    let tituloSitioWeb = document.getElementById("titulo").innerText;

    // Creo y cofiguro el objeto para enviar y recibir solicitudes al servidor
    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidorPlantillaRevista/actualizarCatalogo", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    // Le indico que hacer cuando reciba los datos del servidor
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(this.response);

            if(this.response == "Actualización exitosa") location.reload();
            else
            {                                
                estadoDeLaActualización.innerHTML = 
                `<h4 style="text-align: center;">   
                    Hubo un error al actualizar los datos. Esto puede deberse a un problema con su conexión a internet 
                    o a que el sitio web de donde se extrae la información no esta disponible. Intentelo de nuevo más tarde.
                </h4>`;

                document.getElementById("actualizarCatalogo").style.display="none"; // Hago visible de vuelta el boton de actualizar
            }
        }
    };

    // Envio la solicitud al servidor
    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb});
    xhttp.send(body);
})