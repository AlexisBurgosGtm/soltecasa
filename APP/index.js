var socket = io();
//let btnSideBar = document.getElementById('accordionSidebar');
//let btnReportes = document.getElementById('btnReportes');
//let btnConfig = document.getElementById('btnConfig');


function InicializarBotonesMenu(){
  
        InicializarServiceWorkerNotif();

        //btnNuevo.style="visibility:visible";
      
          funciones.loadView('./views/login/viewLogin.html','contenedor')
            .then(()=>{
              funciones.loadScript('./views/login/controller.js','contenedor')
                .then(()=>{
                  InicializarLogin();
                })
            })
        
        
        //btnConfig.addEventListener('click', ()=>{
        //});
            
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


async function fcnCargarInforme(noOrden){
  funciones.loadView('./views/informe/viewInforme.html','contenedor')
  .then(()=>{
    funciones.loadScript('./views/informe/controller.js','contenedor')
      .then(()=>{
        
        InitializeInforme();

      })
  })
}

