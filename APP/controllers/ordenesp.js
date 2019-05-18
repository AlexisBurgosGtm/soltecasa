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
                            <td>${rows.NOMCLIENTE}</td>
                            <td>${funciones.setMoneda(rows.IMPORTE,'Q ')}</td>
                            <td>
                                <button class="btn btn-sm btn-icon btn-circle btn-primary" data-toggle="modal" data-target="#ModOrdenDetalle" onclick="fcnObtenerDatosOrden(${rows.CORRELATIVO});">
                                    <i class="fas fa-fw fa-table"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon btn-circle btn-info" onclick="fcnFinalizarOrden(${rows.CORRELATIVO},'${status}');">
                                    <i class="fas fa-fw fa-bell"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon btn-circle btn-danger" onclick="fcnEliminarOrden(${rows.CORRELATIVO},'${status}');">
                                    <i class="fas fa-fw fa-trash"></i>
                                </button>
                            </td>
                        </tr>`;        
       }).join('\n');

       document.getElementById(idContainer).innerHTML = tblBody;

    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
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
                        socket.emit('orden eliminada', correlativo);
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

async function fcnEliminarOrden(correlativo,status){
    let question = '¿Está seguro que desea ELIMINAR esta Orden?';
    let url = '/carwash/eliminarorden';
    let labelAviso = 'Orden ELIMINADA Exitosamente';
        
    funciones.Confirmacion(question)
        .then(async (value)=>{
            if (value==true){
                var data =JSON.stringify({
                    token:GlobalToken,
                    correlativo:correlativo
                });
              
                var peticion = new Request(GlobalServerUrl + url, {
                    method: 'DELETE',
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
                        socket.emit('orden eliminada', correlativo);
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

async function fcnObtenerCorrelativoOrden(idContenedorDestino){
    try {
        const response = await fetch(`/carwash/ordencorrelativo?token=${GlobalToken}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            GlobalCorrelativo = rows.CORRELATIVO;
            document.getElementById(idContenedorDestino).innerText = GlobalCorrelativo;
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar del correlativo ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }

    fcnObtenerServicios('contenedor1','contenedor2','contenedor3');
    
};

async function fcnActualizarCorrelativoOrden(correlativo){
    var data =JSON.stringify({
        token:GlobalToken,
        correlativo:correlativo
    });
              
    var peticion = new Request(GlobalServerUrl + '/carwash/ordencorrelativo', {
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
                    console.log('correlativo enviado a actualizar')
                }
            })
        .catch(
            ()=>{
                console.log('Error al tratar de actualizar el correlativo')
            }
        )              
};

async function fcnObtenerServicios(cont1,cont2){
    try {
        const response = await fetch(`/carwash/servicios?token=${GlobalToken}`)
        const json = await response.json();

        let c1 = document.getElementById(cont1);
        let c2 = document.getElementById(cont2);
        //let c3 = document.getElementById(cont3);

        let str1 = ''; let str2 = ''; let str3 = '';
                       
        json.recordset.map((rows)=>{
            if(rows.CODCATEGORIA==1){
                str1 += `<button class='btn btn-round btn-info btn-icon form-control' id='${rows.CODPROD}' onclick="getPrecioServicio(${rows.IMPORTE});">
                            <li class='fa fa-bell'></li>${rows.DESCRIPCION}
                        </button><br>`;
            };
            if(rows.CODCATEGORIA==2){
                str2 += `<div class="form-group">
                             <input type="checkbox" checked data-toggle="toggle" data-on="SI" data-off="NO" data-onstyle="success" data-offstyle="danger" id='${rows.CODPROD}' data-style='ios'>
                             <label>${rows.DESCRIPCION}</label>
                        </div>`;
            };
       }).join('\n');

       //document.getElementById('xxx').checked
       c1.innerHTML = '';
       c2.innerHTML = '';
       c1.innerHTML = str1;
       c2.innerHTML = str2;
       //c3.innerHTML = str3;

       json.recordset.map((rows)=>{
            if(rows.CODCATEGORIA==2){
                $(`#${rows.CODPROD}`).bootstrapToggle().bootstrapToggle('off');
            }
        }).join('\n');
       

    } catch (error) {
        console.log('Error al cargar los servicios' + error);
    }

    fcnObtenerMarcas('cmbMarca');
    
};

function getPrecioServicio(precio){
    let total = document.getElementById('txtTotalLavado');
    total.innerText = precio;
    getTotalOrden();
};

async function getTotalOrden(){
    let content = document.getElementById('txtTotalOrden');
    let tCarwash = Number(document.getElementById('txtTotalLavado').innerText)
    let tOtros = Number(document.getElementById('txtTotalOtros').innerText)
    content.innerText = tCarwash + tOtros;
}

async function fcnObtenerMarcas(idContainer){
    try {
        const response = await fetch(`/carwash/marcas?token=${GlobalToken}`)
        const json = await response.json();

        let c = document.getElementById(idContainer);
        let str1 = '';
                               
        json.recordset.map((rows)=>{
            str1 += `<option value=${rows.CODMARCA}>${rows.DESMARCA}</option>`
       }).join('\n');

       c.innerHTML = str1;            
              
    } catch (error) {
        console.log('Error al cargar las marcas' + error);
    }

    //carga los aromas
    //fcnObtenerAromas('cmbAroma');
    
};

async function fcnObtenerAromas(idContainer){
    try {
        const response = await fetch(`/carwash/aromas?token=${GlobalToken}`)
        const json = await response.json();

        let c = document.getElementById(idContainer);
        let str1 = '';
                               
        json.recordset.map((rows)=>{
            str1 += `<option value=${rows.DESCRIPCION}>${rows.DESCRIPCION}</option>`
       }).join('\n');

       c.innerHTML = str1;            

    } catch (error) {
        console.log('Error al cargar los aromas' + error);
    }
};

async function fcnInsertarOrden(){
    getTotalOrden();
    
    if(Number(document.getElementById('txtTotalOrden').innerHTML)==0){
        funciones.AvisoError('No se puede guardar una Orden con valor Cero (Q 0.00)');
    }else{



    funciones.Confirmacion('¿Está seguro que desea Guardar esta Orden?')
        .then(async (value)=>{
            if(value==true){
                let correlativo = document.getElementById('txtCorrelativo').innerText;
                let total = document.getElementById('txtTotalOrden').innerText;
                let noplaca = document.getElementById('txtPlaca').value;
                let nomcliente = document.getElementById('txtCliente').value;
                let telefono = document.getElementById('txtTelefono').value;
                let codmarca = document.getElementById('cmbMarca').value;
                let color = document.getElementById('txtColor').value;
                let retoque = document.getElementById('cmbRetoque').value;
                let aroma = document.getElementById('cmbAroma').value;

                let fecha = new Date();
                let anio = fecha.getFullYear();
                let mes = fecha.getMonth();
                let dia = fecha.getDay();
                                        
                var data =JSON.stringify({
                    token : GlobalToken,
                    correlativo : correlativo,
                    anio : anio,
                    mes : mes,
                    dia : dia,
                    noplaca : noplaca,
                    importe : total,
                    retoque : retoque,
                    aroma : aroma,
                    nomcliente : nomcliente,
                    color : color,
                    telefono : telefono,
                    codmarca : codmarca
                });
              
                var peticion = new Request(GlobalServerUrl + '/carwash/nuevaorden', {
                    method: 'POST',
                    headers: new Headers({
                        // Encabezados
                       'Content-Type': 'application/json'
                    }),
                    body: data
                  });
            
                  await fetch(peticion)
                  
                  .then(function(res) {
                    //console.log('Estado: ', res.status);
                    if (res.status==200)
                    {   
                        //fcnActualizarCorrelativoOrden(correlativo);
                        funciones.Aviso('Orden Generada Exitosamente!!');
                        btnOrdenesP.click();
                        socket.emit('orden nueva', 'Nueva orden ingresada');
                    }
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se pudo terminar la acción');
                      }
                  )       

            }
        })
    }
    
};

async function CargarBotonesNuevaOrden(){
    let btnPrecio2 = document.getElementById('btnPrecio2');
    //let btnPrecio3 = document.getElementById('btnPrecio3');
    let btnGuardar = document.getElementById('btnGuardar');

    btnPrecio2.addEventListener('click',()=>{
        funciones.SumarATotal('txtTotalOtros');
    });

    btnGuardar.addEventListener('click', ()=>{fcnInsertarOrden();});
    

}