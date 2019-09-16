function InicializarInicio(){
    document.getElementById('txtTitulo').innerText = GlobalCliente;

    let f = new Date();
    let cmbAnio = document.getElementById('cmbAnio');
    let cmbMes = document.getElementById('cmbMes');

    cmbAnio.value = f.getFullYear().toString();
    cmbMes.value = f.getMonth()+1;

    cmbAnio.addEventListener('change',()=>{
        //cargar datos
        getOrdenesCliente();    
    })
    cmbMes.addEventListener('change',()=>{
        //cargar datos
        getOrdenesCliente();    
    })

    document.getElementById('txtBuscar').addEventListener('keyup',()=>{
        funciones.crearBusquedaTabla('tblListado','txtBuscar');
    });

    // asigna el listener el botón imprimir en ordeness
    document.getElementById('btnDetPrint').addEventListener('click',()=>{
        fcnCargarInforme(GlobalSelectedNoOrden);
    })

    //cargar datos
    getOrdenesCliente();
    
};


async function getOrdenesCliente(){

    let anio = document.getElementById('cmbAnio').value;
    let mes = document.getElementById('cmbMes').value;

    let tbl = document.getElementById('tblOrdenes');
    tbl.innerHTML = '<h6 class="text-danger">Cargando órdenes del cliente...</h6>';
    let totalTerminadas =0; let totalPendientes = 0;
    
    try {
        const response = await fetch(`/reports/ordenesmes?codcliente=${GlobalCodCliente}&anio=${anio}&mes=${mes}`)
        const json = await response.json();
        let str = json.recordset.map((rows)=>{
            if(rows.ST=='NO'){
                totalPendientes+=1
            }else{
                totalTerminadas+=1
            }
            let fi = new Date(rows.FECHA); let a = fi.getFullYear(); let m = fi.getMonth()+1; let d = fi.getUTCDate();
            let ff = d.toString() + '/' + m.toString() + '/' + a.toString();

            return `<tr>
                        <td>${rows.ORDEN}</td>
                        <td>${ff}</td>
                        <td>${rows.PROYECTO}</td>
                        <td>${rows.ST}</td>
                        <td>
                            <button class="btn btn-icon btn-warning" onclick="fcnGetDetalle('${rows.ORDEN}');">
                                <i class="fal fa-expand"></i>    
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-icon" onclick="fcnCargarInforme('${rows.ORDEN}');">
                                <i class="fal fa-print"></i>    
                            </button>
                        </td>
                    </tr>`
       }).join('\n');

       tbl.innerHTML = str;
       document.getElementById('txtTotalPendientes').innerText =totalPendientes;
       document.getElementById('txtTotalTerminadas').innerText =totalTerminadas;

    } catch (error) {
        tbl.innerHTML = 'Error al cargar datos...'
        document.getElementById('txtTotalPendientes').innerText =0;
       document.getElementById('txtTotalTerminadas').innerText =0;
    }

};

async function fcnGetDetalle(noOrden){
    
    GlobalSelectedNoOrden = noOrden;

    let tbl = document.getElementById('tblDetalle');

    try {
        const response = await fetch(`/reports/elementosorden?orden=${noOrden}`)
        const json = await response.json();
        let str = json.recordset.map((rows)=>{
            
            //let fi = new Date(rows.FECHA); let a = fi.getFullYear(); let m = fi.getMonth()+1; let d = fi.getUTCDate();
            //let ff = d.toString() + '/' + m.toString() + '/' + a.toString();

            return `<tr>
                        <td>${rows.IDENTIFICACION}</td>
                        <td>${rows.MANUFACTURA}</td>
                        <td>${rows.ROTURA}</td>
                        <td>${rows.EDAD}</td>
                        <td>${rows.ELEMENTO}</td>
                    </tr>`
       }).join('\n');

       tbl.innerHTML = str;
       $("#ModalData").modal('show');

    } catch (error) {
        tbl.innerHTML = 'Error al cargar datos...'
       funciones.AvisoError('No se pudo cargar la lista de Elementos disponibles')
    }
}
