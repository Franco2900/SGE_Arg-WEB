let botonCambiarFondo = document.getElementById("botonCambiarFondo");
                
botonCambiarFondo.addEventListener("click", function(){
                    
    if(botonCambiarFondo.innerText == "Modo claro") 
    {
        botonCambiarFondo.innerText = "Modo oscuro";

        document.getElementsByTagName("body")[0].classList.remove('fondoClaro');
        document.getElementsByTagName("body")[0].classList.add('fondoOscuro');

        document.getElementById("tablaRevistas").setAttribute('class', 'table table-dark table-striped table-bordered');
    }
    else 
    {
        botonCambiarFondo.innerText = "Modo claro";
        
        document.getElementsByTagName("body")[0].classList.remove('fondoOscuro');
        document.getElementsByTagName("body")[0].classList.add('fondoClaro');

        document.getElementById("tablaRevistas").setAttribute('class', 'table table-light table-striped table-bordered');
    }
                    
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/

document.getElementById("buscarPaginaEspecifica").addEventListener("change", function(){

    let tituloSitioWeb = document.getElementById("titulo").innerText;
    let paginaBuscada = Number(document.getElementById("buscarPaginaEspecifica").value);

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/api/buscarPaginaEspecifica", true); 
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
    xhttp.open("POST", "http://localhost:3000/api/paginaAnterior", true); 
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
    xhttp.open("POST", "http://localhost:3000/api/paginaSiguiente", true); 
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
    xhttp.open("POST", "http://localhost:3000/api/primeraPagina", true); 
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
    xhttp.open("POST", "http://localhost:3000/api/ultimaPagina", true); 
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

    let tituloSitioWeb = document.getElementById("titulo").innerText;

    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/api/actualizarCatalogo", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    
    xhttp.onreadystatechange = function() 
    {         
        if (this.readyState == 4 && this.status == 200)
        {
            location.reload();
        }
    };

    let body = JSON.stringify({tituloSitioWeb: tituloSitioWeb});
    xhttp.send(body);
})