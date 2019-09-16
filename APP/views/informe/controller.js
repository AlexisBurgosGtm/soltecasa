function InitializeInforme(){
    document.getElementById('btnAtras').addEventListener('click',()=>{
        fcnIniciarOrdenes();
    });
    document.getElementById('btnImprimir').addEventListener('click',()=>{
        window.print();
    })

    fcnGetInforme(GlobalSelectedNoOrden);
}

async function fcnGetInforme(noOrden){
    console.log('solicitando informe..')
    try {
        const response = await fetch(`/reports/rptinforme?orden=${noOrden}`)
        const json = await response.json();
        let str = json.recordset.map((rows)=>{
            console.log(rows);
            return `${rows}`
       }).join('\n');

       document.getElementById('contenedor').innerHTML = str;
       

    } catch (error) {
        console.log(error)
       //funciones.AvisoError('No se pudo cargar la lista de Elementos disponibles')
    }
}


async function fcnIniciarOrdenes(){
    funciones.loadView('../views/inicio/viewInicio.html','contenedor')
    .then(()=>{
        funciones.loadScript('./views/inicio/controller.js','contenedor')
        .then(()=>{
            InicializarInicio();
        })

    })
}