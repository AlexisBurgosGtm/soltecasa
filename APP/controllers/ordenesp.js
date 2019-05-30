async function fcnCargarOrdenes(idContainer,status){

    try {
        const response = await fetch(`/carwash/ordenespendientes?token=${GlobalToken}&st=${status}`)
        const json = await response.json();
         
        let tblBody = json.recordset.map((rows)=>{
            if (status=='P'){
                return `<tr>
                <td>${rows.CORRELATIVO}
                    <br>
                    <small>Inicio : <b>${rows.DIA + '/' + rows.MES + '/' + rows.ANIO}</b></small>
                </td>
                <td>${rows.NOPLACA}</td>
                <td>${rows.DESMARCA}</td>
                <td><button class="btn btn-md" style='background-color:${rows.COLOR}'>    </button></td>
                <td>${rows.NOMCLIENTE}</td>
                <td>${funciones.setMoneda(rows.IMPORTE,'Q ')}</td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-primary" data-toggle="modal" data-target="#ModOrdenDetalle" onclick="fcnObtenerDatosOrden(${rows.CORRELATIVO});">
                        <i class="fas fa-fw fa-table"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-info" data-toggle="modal" data-target="#ModOrdenF" onclick="fcnObtenerDatosOrdenF(${rows.CORRELATIVO},'${rows.NOPLACA}','${rows.NOMCLIENTE}',${rows.IMPORTE});">
                        <i class="fas fa-fw fa-dollar-sign"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-danger" onclick="fcnEliminarOrden(${rows.CORRELATIVO},'${status}');">
                        <i class="fas fa-fw fa-trash"></i>
                    </button>
                </td>
            </tr>`;        
            };
            if (status=='F'){
                return `<tr>
                <td>${rows.CORRELATIVO}
                <br>
                    <small>Inicio : <b>${rows.DIA + '/' + rows.MES + '/' + rows.ANIO}</b></small>
                </td>
                <td>${rows.NOPLACA}</td>
                <td>${rows.DESMARCA}</td>
                <td>${rows.COLOR}</td>
                <td>${rows.NOMCLIENTE}
                <br>
                <small>Fin : <b>${rows.DIAFIN + '/' + rows.MESFIN + '/' + rows.ANIOFIN}</b></small>
                </td>
                <td>${funciones.setMoneda(rows.IMPORTE,'Q ')}</td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-primary" data-toggle="modal" data-target="#ModOrdenDetalle" onclick="fcnObtenerDatosOrden(${rows.CORRELATIVO});">
                        <i class="fas fa-fw fa-table"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-warning" onclick="fcnFinalizarOrden(${rows.CORRELATIVO},'${status}');">
                        <i class="fas fa-fw fa-bell"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-icon btn-circle btn-danger" onclick="fcnEliminarOrden(${rows.CORRELATIVO},'${status}');">
                        <i class="fas fa-fw fa-trash"></i>
                    </button>
                </td>
            </tr>`;        
            };
            
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
            document.getElementById('txtDataTelefono').innerHTML = `<a href='https://api.whatsapp.com/send?phone=502${rows.TELEFONO}&text=Quick%20Carwash%20'>${rows.TELEFONO}</a>`;
            document.getElementById('txtDataTipoLavado').innerHTML = `<b>${rows.CARWASH}</b>`
            let strServicios = ''
            if(rows.O1==1){strServicios+='LIMPIEZA DE TAPICERIA, '};if(rows.O2==1){strServicios+='RESTAURACION DE SILVINES, '};
            if(rows.O3==1){strServicios+='RESTAURACION DE PLASTICOS, '};if(rows.O4==1){strServicios+='PULIDO Y LUSTRADO, '};
            if(rows.O5==1){strServicios+='LUSTRADO A MANO, '};if(rows.O6==1){strServicios+='LIMPIEZA DE AROS'};
            document.getElementById('txtDataOtrosServicios').innerText = strServicios
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar datos de la orden ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }


};

async function fcnObtenerDatosOrdenF(correlativo,placa,cliente,importe){
    document.getElementById('txtTituloF').innerText= ' Cobro de la Orden No. ' + correlativo;
    document.getElementById('txtFPlacas').innerText = placa;
    document.getElementById('txtFCliente').innerText =cliente;
    document.getElementById('txtFTotal').innerText = funciones.setMoneda(importe, 'Q ');
    document.getElementById('txtFEfectivo').value = importe;
    document.getElementById('txtFTarjeta').value = 0;
    document.getElementById('txtFSaldo').innerText = funciones.setMoneda(importe, 'Q ');
    document.getElementById('txtFObs').value = '';

    document.getElementById('btnFinalizarOrden').addEventListener('click',()=>{
        if (document.getElementById('txtFSaldo').innerText == document.getElementById('txtFTotal').innerText){
            fcnFinalizarOrden(correlativo,'P');
        }else{
            funciones.AvisoError('El monto indicado en el pago no es igual al valor de la Orden');
        }
     });

    document.getElementById('txtFEfectivo').addEventListener('keyup' ,()=>{
        let efectivo =Number(document.getElementById('txtFEfectivo').value)
        let tarjeta = Number(document.getElementById('txtFTarjeta').value)

        document.getElementById('txtFSaldo').innerText = funciones.setMoneda(getTotalPagado(efectivo,tarjeta), 'Q ');
    });

    document.getElementById('txtFTarjeta').addEventListener('keyup' ,()=>{
        let efectivo =Number(document.getElementById('txtFEfectivo').value)
        let tarjeta = Number(document.getElementById('txtFTarjeta').value)

        document.getElementById('txtFSaldo').innerText = funciones.setMoneda(getTotalPagado(efectivo,tarjeta), 'Q ');
    });
    
};

function getTotalPagado(efectivo,tarjeta){
    return Number(efectivo) + Number(tarjeta);
};

async function fcnFinalizarOrden(correlativo,status){
    let question = '';let url = ''; let labelAviso = '';
    let efect; let tarj;
    let obs; 
    if (status=='P'){
        question = '¿Está seguro que desea Finalizar esta Orden?';
        url = '/carwash/finalizarorden';
        labelAviso = 'Orden Finalizada Exitosamente';

        efect = Number(document.getElementById('txtFEfectivo').value);
        tarj = Number(document.getElementById('txtFTarjeta').value);
        obs = document.getElementById('txtFObs').value;
        
    };
    if (status=='F'){
        question = '¿Está seguro que desea Re-Activar esta Orden?';
        url = '/carwash/reactivarorden';
        labelAviso = 'Orden Re-Activada Exitosamente';
        obs= 'SN'
    }

    funciones.Confirmacion(question)
        .then(async (value)=>{
            if (value==true){

                
                    var data =JSON.stringify({
                        token:GlobalToken,
                        correlativo:correlativo,
                        efectivo : efect,
                        tarjeta: tarj,
                        obs: obs
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
                      
                      .then(async function(res) {
                        console.log('Estado: ', res.status);
                        if (res.status==200)
                        {   
                            
                            await fcnCargarOrdenes('tblOrdenes',status);
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
                        socket.emit('orden eliminada', 'No. ' + correlativo);
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
//1
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

    //fcnObtenerServicios('contenedor1','contenedor2','contenedor3');
    
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
//2
async function fcnObtenerServicios(cont1,cont2,cont3){
    try {
        const response = await fetch(`/carwash/servicios?token=${GlobalToken}`)
        const json = await response.json();

        let c1 = document.getElementById(cont1);
        let c2 = document.getElementById(cont2);
        //let c3 = document.getElementById(cont3);

        let str1 = ''; let str2 = ''; let str3 = '';
                       
        json.recordset.map((rows)=>{
            if(rows.CODCATEGORIA==1){
                str1 += `<button class='btn btn-round btn-info btn-icon form-control' id='${rows.CODPROD}' onclick="getPrecioServicio(${rows.IMPORTE},${rows.CODPROD});">
                            <li class='fa fa-bell'></li>${rows.DESCRIPCION}
                        </button><br>`;
            };
            /*
            if(rows.CODCATEGORIA==2){
                str2 += `<div class="form-group">
                             <input type="checkbox" checked data-toggle="toggle" data-on="SI" data-off="NO" data-onstyle="success" data-offstyle="danger" id='${rows.CODPROD}' onclick('fcnInsertarOrdenDetalle(${rows.CODPROD});')>
                             <label>${rows.DESCRIPCION}</label>
                        </div>`;
            };*/
       }).join('\n');

       //document.getElementById('xxx').checked
       c1.innerHTML = '';
       //c2.innerHTML = '';
       c1.innerHTML = str1;
       //c2.innerHTML = str2;
       /*
       json.recordset.map((rows)=>{
            if(rows.CODCATEGORIA==2){
                $(`#${rows.CODPROD}`).bootstrapToggle().bootstrapToggle('off');
            }
        }).join('\n');
       */
      $('#txtLimpTapiz').bootstrapToggle().bootstrapToggle('off');
      $('#txtRestSilv').bootstrapToggle().bootstrapToggle('off');
      $('#txtRestPlas').bootstrapToggle().bootstrapToggle('off');
      $('#txtPulLust').bootstrapToggle().bootstrapToggle('off');
      $('#txtLustMan').bootstrapToggle().bootstrapToggle('off');
      $('#txtLimpAros').bootstrapToggle().bootstrapToggle('off');

    } catch (error) {
        console.log('Error al cargar los servicios' + error);
    }

    //fcnObtenerMarcas('cmbMarca');
    
};

function getPrecioServicio(precio,codprod){
    GlobalTipoCarwash = codprod;
    console.log('tipo carwash: ' + GlobalTipoCarwash);
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
//3
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
//4
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
                let colorv = document.getElementById('txtColor').value;
                let retoque = document.getElementById('cmbRetoque').value;
                let aroma = document.getElementById('cmbAroma').value;

                let tipocarwash = GlobalTipoCarwash;              
                let otrolimptapiz; if($('#txtLimpTapiz').prop('checked')==true){otrolimptapiz=1}else{otrolimptapiz=0};
                let otrorestsilv; if($('#txtRestSilv').prop('checked')==true){otrorestsilv=1}else{otrorestsilv=0};
                let otrorestplast; if($('#txtRestPlas').prop('checked')==true){otrorestplast=1}else{otrorestplast=0};
                let otropulidolustrado; if($('#txtPulLust').prop('checked')==true){otropulidolustrado=1}else{otropulidolustrado=0};
                let otrolustrmano; if($('#txtLustMan').prop('checked')==true){otrolustrmano=1}else{otrolustrmano=0};
                let otrolimparos;if($('#txtLimpAros').prop('checked')==true){otrolimparos=1}else{otrolimparos=0};

                console.log('otro 1: ' + otrolimptapiz);

                let fecha = new Date();
                let anio = fecha.getFullYear();
                let mes = fecha.getMonth()+1;
                let dia = fecha.getDate();
                                        
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
                    colorv : colorv,
                    telefono : telefono,
                    codmarca : codmarca,
                    o1: otrolimptapiz,
                    o2: otrorestsilv,
                    o3: otrorestplast,
                    o4: otropulidolustrado,
                    o5: otrolustrmano,
                    o6: otrolimparos,
                    tipocarwash: tipocarwash
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
                        socket.emit('orden nueva', 'Orden No. ' + correlativo + ', Placa: ' + noplaca + ', Aroma: ' + aroma);
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

    let txtPlaca = document.getElementById('txtPlaca');

    btnPrecio2.addEventListener('click',()=>{
        funciones.SumarATotal('txtTotalOtros');
    });

    txtPlaca.addEventListener('keyup',()=>{
        fcnObtenerDatosCliente(document.getElementById('txtPlaca').value);
    })

    btnGuardar.addEventListener('click', ()=>{
        fcnInsertarOrden();
    });
    

}

async function fcnObtenerDatosCliente(noplaca){

    document.getElementById('txtCliente').value = '';
    document.getElementById('txtTelefono').value = '';
    document.getElementById('cmbMarca').value = 1;
    document.getElementById('txtColor').value = '';

    try {
        const response = await fetch(`/carwash/datoscliente?token=${GlobalToken}&noplaca=${noplaca}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            document.getElementById('txtCliente').value = rows.NOMCLIENTE || '';
            document.getElementById('txtTelefono').value = rows.TELEFONO || '';
            document.getElementById('cmbMarca').value = rows.CODMARCA || 1;
            document.getElementById('txtColor').value = rows.COLOR || '';
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar datos del cliente');
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }


};