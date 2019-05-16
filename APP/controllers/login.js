let btnIniciar = document.getElementById('btnIniciar');

btnIniciar.addEventListener('click',()=>{
    funciones.loadView('../views/viewInicio.html','contenedor')
        .then(()=>{
            InicializarBotonesMenu();
        })
})