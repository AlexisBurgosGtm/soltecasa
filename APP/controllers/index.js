var socket = io();

//let btnSideBar = document.getElementById('accordionSidebar');


//let btnReportes = document.getElementById('btnReportes');
let btnConfig = document.getElementById('btnConfig');
let btnNuevo = document.getElementById('btnNuevo');
btnNuevo.style="visibility:hidden";

function InicializarBotonesMenu(){
  
  InicializarServiceWorkerNotif();

  //funciones.loadView('../views/viewInicio.html','contenedor')
  //funciones.loadView('../views/viewOrdenesP.html','contenedor')
    //.then(()=>{

        //btnNuevo.style="visibility:visible";

        
          funciones.loadView('../views/viewLogin.html','contenedor')
            .then(()=>{
              funciones.loadScript('../controllers/login.js','contenedor')
                .then(()=>{
                  //getTotalesDia();
                })
            })
        
        
        btnConfig.addEventListener('click', ()=>{

        });
        
        
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


socket.on('orden nueva', function(msg){
    //persistentNotification(msg);
    try {
    
    } catch (error) {
    
    }
    //funciones.NotificacionPersistent(msg,"Nueva Orden generada");
});


InicializarBotonesMenu();

/*
funciones.loadView('../views/viewLogin.html','contenedor')
  .then(()=>{
    funciones.loadScript('../controllers/login.js','contenedor');
})
*/