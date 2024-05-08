let botonCambiarFondo = document.getElementById("botonCambiarFondo");
                  
botonCambiarFondo.addEventListener("click", function(){
                     
    let fondoPantallaActual = botonCambiarFondo.innerText;
    let nuevoFondo = "";

    if(fondoPantallaActual == "Modo claro") 
    {
        document.getElementsByTagName("body")[0].classList.remove('fondoClaro');
        document.getElementsByTagName("body")[0].classList.add('fondoOscuro');
        
        botonCambiarFondo.innerText = "Modo oscuro";
        botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb-off');
        
        document.getElementById("tablaEstadosDeLasRevistas").setAttribute('class', 'text-center table table-dark table-bordered');

        nuevoFondo = "Modo oscuro";
    }
    else 
    {
        document.getElementsByTagName("body")[0].classList.remove('fondoOscuro');
        document.getElementsByTagName("body")[0].classList.add('fondoClaro');
        
        botonCambiarFondo.innerText = "Modo claro";
        botonCambiarFondo.setAttribute('class', 'bi bi-lightbulb');
        
        document.getElementById("tablaEstadosDeLasRevistas").setAttribute('class', 'text-center table table-light table-bordered');

        nuevoFondo = "Modo claro";
    }

    console.log(nuevoFondo);
    
    const xhttp = new XMLHttpRequest();    
    xhttp.open("POST", "http://localhost:3000/funcionesServidor/fondoPantalla", true); 
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    let body = JSON.stringify({nuevoFondo: nuevoFondo});
    xhttp.send(body);
});