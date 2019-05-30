var socket = io();

//let btnSideBar = document.getElementById('accordionSidebar');
let btnInicio = document.getElementById('btnInicio');
let btnOrdenesP = document.getElementById('btnOrdenesP');
let btnOrdenesF = document.getElementById('btnOrdenesF');
let btnReportes = document.getElementById('btnReportes');
let btnConfig = document.getElementById('btnConfig');
let btnNuevo = document.getElementById('btnNuevo');
btnNuevo.style="visibility:hidden";

function InicializarBotonesMenu(){
  
  InicializarServiceWorkerNotif();

  //funciones.loadView('../views/viewInicio.html','contenedor')
  //funciones.loadView('../views/viewOrdenesP.html','contenedor')
    //.then(()=>{

        btnNuevo.style="visibility:visible";

        btnInicio.addEventListener('click',()=>{
          funciones.loadView('../views/viewInicio.html','contenedor')
            .then(()=>{
              funciones.loadScript('../controllers/dashboard.js','contenedor')
                .then(()=>{
                  //getTotalesDia();
                })
            })
        });
        btnNuevo.addEventListener('click',()=>{
          funciones.loadView('../views/viewNuevaOrden.html','contenedor')
          .then(()=>{
              funciones.loadScript('../controllers/ordenesp.js','contenedor')
              .then(async()=>{
                await fcnObtenerCorrelativoOrden('txtCorrelativo');
                await fcnObtenerServicios('contenedor1','contenedor2','contenedor3');
                await fcnObtenerMarcas('cmbMarca');
                await fcnObtenerAromas('cmbAroma');
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


socket.on('orden nueva', function(msg){
    //persistentNotification(msg);
    try {
      fcnCargarOrdenes('tblOrdenes','P');
    } catch (error) {
      console.log('No se logró cargar el listado luego del socket')
    }
    funciones.NotificacionPersistent(msg,"Nueva Orden generada");
});

socket.on('orden eliminada', function(msg){
  //persistentNotification(msg);
  try {
    //fcnCargarOrdenes('tblOrdenes','P');
    funciones.NotificacionPersistent(msg,'Se eliminó la orden');
  } catch (error) {
    console.log('No se logró cargar el listado luego del socket')
  }
  
});

socket.on('orden finalizada', function(msg){
  //persistentNotification(msg);
  try {
    fcnCargarOrdenes('tblOrdenes','P');
  } catch (error) {
    console.log('No se logró cargar el listado luego del socket')
  }
});


InicializarBotonesMenu();

/*
funciones.loadView('../views/viewLogin.html','contenedor')
  .then(()=>{
    funciones.loadScript('../controllers/login.js','contenedor');
})
*/