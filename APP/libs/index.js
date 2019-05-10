let btnServicioG = document.getElementById('btnServicioG');
let btnServicioM = document.getElementById('btnServicioM');
let btnServicioP = document.getElementById('btnServicioP');

let btnGuardarOrden = document.getElementById('btnGuardarOrden');
let btnCancelarOrden = document.getElementById('btnCancelarOrden');

let txtServicioPrecio = document.getElementById('txtServicioPrecio');

var socket = io();


btnServicioG.addEventListener('click', ()=>{
    txtServicioPrecio.innerText = 'Q 129.00';
});

btnServicioM.addEventListener('click', ()=>{
    txtServicioPrecio.innerText = 'Q 119.00';
});

btnServicioP.addEventListener('click', ()=>{
    txtServicioPrecio.innerText = 'Q 99.00';
});

btnGuardarOrden.addEventListener('click', ()=>{
    funciones.Confirmacion('¿Está seguro que desea Generar esta Orden?')
    .then((value)=>{
        if (value==true){
            btnCancelarOrden.click();
            socket.emit('orden nueva', 'nueva orden por valor de ' + txtServicioPrecio.innerText);
            funciones.Aviso('Orden Generada Exitosamente!!')
        }
        
    })
})





socket.on('orden nueva', function(msg){
    funciones.hablar(msg);
  //$('#messages').append($('<li>').text(msg));
});