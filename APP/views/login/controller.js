function InicializarLogin(){

    btnIniciar.addEventListener('click',()=>{
        fcnLogin('txtUsuario','txtPass')
    })

    funciones.loadCss('./css/page-login.css','contenedor')

}

async function fcnLogin(idUser,idPass){
    let usuario = document.getElementById(idUser).value;
    let pass = document.getElementById(idPass).value;

    try {
        const response = await fetch(`/usuarios/login?usuario=${usuario}&pass=${pass}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            console.log(rows.toString());
            if (rows.USUARIO==usuario){
                GlobalUser = rows.USUARIO;
                GlobalCliente = rows.NOMBRE;
                GlobalCodCliente = rows.CODCLIENTE;
                fcnIniciar();
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
        funciones.loadScript('./views/inicio/controller.js','contenedor')
        .then(()=>{
            InicializarInicio();
        })

    })
}