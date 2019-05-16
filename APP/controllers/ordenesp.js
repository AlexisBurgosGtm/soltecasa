async function fcnCargarOrdenes(idContainer,status){

    try {
        const response = await fetch(`/carwash/ordenespendientes?token=${GlobalToken}&st=${status}`)
        const json = await response.json();
         
        let tblBody = json.recordset.map((rows)=>{
                return `<tr>
                            <td>${rows.CORRELATIVO}</td>
                            <td>${rows.NOPLACA}</td>
                            <td>${rows.DESMARCA}</td>
                            <td>${rows.COLOR}</td>
                            <td>${rows.DESCATEGORIA}</td>
                            <td>${funciones.setMoneda(rows.IMPORTE,'Q ')}</td>
                            <td>
                                <button class="btn btn-sm btn-icon btn-circle btn-primary" data-toggle="modal" data-target="#ModOrdenDetalle" onclick="fcnObtenerDatosOrden(${rows.CORRELATIVO});">
                                    <i class="fas fa-fw fa-table"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon btn-circle btn-danger" onclick="fcnFinalizarOrden(${rows.CORRELATIVO},'${status}');">
                                    <i class="fas fa-fw fa-trash"></i>
                                </button>
                            </td>
                        </tr>`;        
       }).join('\n');

       document.getElementById(idContainer).innerHTML = tblBody;

    } catch (error) {
        console.log(error);
        funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
};

async function fcnObtenerDatosOrden(correlativo){
    try {
        const response = await fetch(`/carwash/datosorden?token=${GlobalToken}&correlativo=${correlativo}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            document.getElementById('txtDataCorrelativo').innerText = 'Detalle de la Orden No. ' + rows.CORRELATIVO;
            document.getElementById('txtDataPlacas').innerHTML = ` <b>${rows.NOPLACA}</b>`;
            document.getElementById('txtDataCliente').innerHTML = ` <b>${rows.NOMCLIENTE}</b>`;
            document.getElementById('txtDataTotal').innerHTML = ` <b>${funciones.setMoneda(rows.IMPORTE,'Q ')}</b>`;
            document.getElementById('txtDataRetoque').innerHTML = ` <b>${rows.RETOQUE}</b>`;
            document.getElementById('txtDataAroma').innerHTML = ` <b>${rows.AROMA}</b>`;
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar datos de la orden ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }


};

async function fcnFinalizarOrden(correlativo,status){
    let question = '';let url = ''; let labelAviso = '';
    if (status=='P'){
        question = '¿Está seguro que desea Finalizar esta Orden?';
        url = '/carwash/finalizarorden';
        labelAviso = 'Orden Finalizada Exitosamente';
    };
    if (status=='F'){
        question = '¿Está seguro que desea Re-Activar esta Orden?';
        url = '/carwash/reactivarorden';
        labelAviso = 'Orden Re-Activada Exitosamente';
    }

    funciones.Confirmacion(question)
        .then(async (value)=>{
            if (value==true){
                var data =JSON.stringify({
                    token:GlobalToken,
                    correlativo:correlativo
                });
              
                var peticion = new Request(GlobalServerUrl + url, {
                    method: 'PUT',
                    headers: new Headers({
                        // Encabezados
                       'Content-Type': 'application/json'
                    }),
                    body: data
                  });
            
                  await fetch(peticion)
                  
                  .then(function(res) {
                    console.log('Estado: ', res.status);
                    if (res.status==200)
                    {   
                        fcnCargarOrdenes('tblOrdenes',status);
                        funciones.Aviso(labelAviso);
                    }
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se pudo terminar la acción');
                      }
                  )              
            }
        })   
};
