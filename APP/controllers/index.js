//let btnSideBar = document.getElementById('accordionSidebar');
let btnInicio = document.getElementById('btnInicio');
let btnOrdenesP = document.getElementById('btnOrdenesP');
let btnOrdenesF = document.getElementById('btnOrdenesF');
let btnReportes = document.getElementById('btnReportes');
let btnConfig = document.getElementById('btnConfig');
let btnNuevo = document.getElementById('btnNuevo');
btnNuevo.style="visibility:hidden";
//var socket = io();

function InicializarBotonesMenu(){
  
  InicializarServiceWorkerNotif();

  //funciones.loadView('../views/viewInicio.html','contenedor')
  //funciones.loadView('../views/viewOrdenesP.html','contenedor')
    //.then(()=>{

        btnNuevo.style="visibility:visible";

        btnInicio.addEventListener('click',()=>{
          funciones.loadView('../views/viewInicio.html','contenedor');
        });
        btnNuevo.addEventListener('click',()=>{
          funciones.loadView('../views/viewNuevaOrden.html','contenedor')
          .then(()=>{
              funciones.loadScript('../controllers/ordenesp.js','contenedor')
              .then(()=>{
                fcnObtenerCorrelativoOrden('txtCorrelativo');
                CargarBotonesNuevaOrden();
            })
              
          })
        });  
        btnOrdenesP.addEventListener('click', ()=>{
            funciones.loadView('../views/viewOrdenesP.html','contenedor')
              .then(()=>{
                btnNuevo.style="visibility:visible";
                funciones.loadScript('../controllers/ordenesp.js','contenedor')
                  .then(()=>{fcnCargarOrdenes('tblOrdenes','P');})
              })
        });
        btnOrdenesF.addEventListener('click', ()=>{
          funciones.loadView('../views/viewOrdenesF.html','contenedor')
          .then(()=>{
            btnNuevo.style="visibility:visible";
            funciones.loadScript('../controllers/ordenesp.js','contenedor')
              .then(()=>{fcnCargarOrdenes('tblOrdenes','F');})
          })
        });
        btnReportes.addEventListener('click', ()=>{

        });
        btnConfig.addEventListener('click', ()=>{

        });
        
        btnOrdenesP.click();

  //})

}

function InicializarServiceWorkerNotif(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
   navigator.serviceWorker.register('sw.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'SW registration failed'));
  };
  
  requestPermission();
}

if ('Notification' in window) {};

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    //$status.innerText = result;
  });
}

/*
socket.on('orden nueva', function(msg){
    persistentNotification(msg);
    funciones.hablar(msg);
  //$('#messages').append($('<li>').text(msg));
});
*/

InicializarBotonesMenu();

/*
funciones.loadView('../views/viewLogin.html','contenedor')
  .then(()=>{
    funciones.loadScript('../controllers/login.js','contenedor');
})
*/