function InicializarLogin(){
    funciones.loadCss('./css/page-login.css','contenedor');
    btnIniciar.addEventListener('click',()=>{
        fcnLogin('txtUsuario','txtPass')
    })

    

}

async function fcnLogin(idUser,idPass){
    let usuario = document.getElementById(idUser).value;
    let pass = document.getElementById(idPass).value;

    try {
        const response = await fetch(`/usuarios/login?usuario=${usuario}&pass=${pass}`)
        const json = await response.json();
                       
        json.recordset.map(async (rows)=>{
           
            if (rows.USUARIO==usuario){
                GlobalUser = rows.USUARIO;
                GlobalCliente = rows.NOMBRE;
                GlobalCodCliente = rows.CODCLIENTE;
                await fcnIniciar();
            }else{
                funciones.AvisoError('Usuario y/o contraseña no existen');
            }
       }).join('\n');
     
    } catch (error) {
        funciones.AvisoError('Ha ocurrido un error');
    }
}

async function fcnIniciar(){
    
    funciones.loadView('../views/inicio/viewInicio.html','contenedor')
    .then(()=>{
        // carga los estilos de la vista
        
        funciones.loadScript('./views/inicio/controller.js','contenedor')
        .then(()=>{
            InicializarInicio();
        })

    })
}