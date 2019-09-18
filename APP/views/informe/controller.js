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

    //CARGA LOS ELEMENTOS DEL ENCABEZADO DE PAGINA
    document.getElementById('lbNoOrden').innerHTML = `<b>${GlobalSelectedNoOrden}</b>`;
    //document.getElementById('lbFecha').innerHTML= ``

    //CARGA LOS DATOS DEL CLIENTE   
    try {
        const response = await fetch(`/reports/clienteorden?orden=${noOrden}`)
        const json = await response.json();
        json.recordset.map((rows)=>{
            document.getElementById('lbFecha').innerHTML = `<b>${rows.FECHA}</b>`
            document.getElementById('lbNomCliente').innerText = rows.CLIENTE
            document.getElementById('lbProyecto').innerText = rows.PROYECTO
            document.getElementById('lbDirProyecto').innerText = rows.DIRPROYECTO
            document.getElementById('lbAtencion').innerText = rows.CONTACTO
            
       }).join('\n');
       
    } catch (error) {
        console.log(error)
       //funciones.AvisoError('No se pudo cargar la lista de Elementos disponibles')
    };


    // SOLICITANDO LA TABLA DE ELEMENTOS
    try {
        let areatag; let manufactura;
        const response = await fetch(`/reports/elementosorden?orden=${noOrden}`)
        const json = await response.json();
        let strElementos = json.recordset.map((rows)=>{
            areatag = rows.AREATAG;
            if (Number(rows.TIPOCOSTOCILINDRO)==1){
                manufactura = 'Datos proporcionados por cliente';
            }else{
                manufactura = 'Muestra tomada en campo';
            }
            
            return `<tr>
            <td>${rows.IDENTIFICACION}</td>
            <td>${rows.ELEMENTO}</td>
            <td>${rows.RESISTENCIAREQ}</td>
            <td>${rows.TEMPERATURACONCRETO}</td>
            <td>${rows.PLG}</td>
            <td>${rows.EDAD}</td>
            <td>${rows.GUIA}</td>            
        </tr>`

       }).join('\n');
      
        document.getElementById('tblElementos').innerHTML = strElementos;
       
        document.getElementById('lbTag').innerText = areatag;
        document.getElementById('lbManufactura').innerText = manufactura;

    } catch (error) {
        console.log(error)
       //funciones.AvisoError('No se pudo cargar la lista de Elementos disponibles')
    };

        // SOLICITANDO LA TABLA DE PROMEDIOS
        try {
            const response = await fetch(`/reports/promediosalcanzados?orden=${noOrden}`)
            const json = await response.json();
            let strPromedios = json.recordset.map((rows)=>{
                return `<tr>
                <td>${rows.EDAD}</td>
                <td>${rows.FECHA.replace('T00:00:00.000Z','')}</td>
                <td>${rows.RESISTENCIAMPA}</td>
                <td>${rows.EQUIVALENCIAPSI}</td>
                <td>${rows.ALCANZADO}</td>
            </tr>`
    
           }).join('\n');
          
            document.getElementById('tblPromedios').innerHTML = strPromedios;
    
        } catch (error) {
            console.log(error)
           //funciones.AvisoError('No se pudo cargar la lista de Elementos disponibles')
        };

        let data =            {
            data: [
                [3, 82.07],
                [7, 91.98],
                [28, 75],
                [56, 126.6]
            ]
        }

        // gráfico de comparación de promedios
        var flotBar = $.plot("#flot-bar", [
            data
        ],
            {
                series:
                {
                    bars:
                    {
                        show: true,
                        lineWidth: 10,
                        fillColor: myapp_get_color.fusion_200
                    }
                },
                grid:
                {
                    borderWidth: 1,
                    borderColor: '#eee'
                },
                yaxis:
                {
                    tickColor: '#eee',
                    font:
                    {
                        color: '#999',
                        size: 10
                    }
                },
                xaxis:
                {
                    tickColor: '#eee',
                    font:
                    {
                        color: '#999',
                        size: 10
                    }
                }
            });

}


// carga el view
async function fcnIniciarOrdenes(){
    funciones.loadView('../views/inicio/viewInicio.html','contenedor')
    .then(()=>{
        funciones.loadScript('./views/inicio/controller.js','contenedor')
        .then(()=>{
            InicializarInicio();
        })

    })
}