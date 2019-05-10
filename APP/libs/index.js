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
    persistentNotification(msg);
    //funciones.hablar(msg);
  //$('#messages').append($('<li>').text(msg));
});





if ('Notification' in window) {
  //$status.innerText = Notification.permission;
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    //$status.innerText = result;
  });
}


function persistentNotification(msn) {
  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    alert('Persistent Notification API not supported!');
    return;
  }
  
  try {
    navigator.serviceWorker.getRegistration()
      .then(reg => reg.showNotification(msn))
      .catch(err => alert('Service Worker registration error: ' + err));
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

requestPermission();