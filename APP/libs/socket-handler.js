const socket = io();

socket.on('productos nuevo', function(msg){
    funciones.NotificacionPersistent("Nuevo producto",msg);
});
