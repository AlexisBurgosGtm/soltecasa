
try {
    let btnCargarFechaInicio = document.getElementById('btnCargarFechaInicio');
    btnCargarFechaInicio.addEventListener('click', async ()=>{
        await fcnCargarOrdenesFecha('tblOrdenesInicio')
        await getTotalesDia();
    })
    
} catch (error) {
    
}


async function getTotalesDia(){
    
    let f = new Date(document.getElementById('txtFecha').value); //new Date();
    let anio = f.getFullYear();
    let mes = f.getMonth()+1;
    let dia = f.getDate();

    try {
        const response = await fetch(`/carwash/totaldia?token=${GlobalToken}&anio=${anio}&mes=${mes}&dia=${dia}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            document.getElementById('txtTotalDia').innerText = funciones.setMoneda(rows.IMPORTE, 'Q ');
            document.getElementById('txtTotalOrdenes').innerText = rows.CONTEO;
            
            //document.getElementById('txtTotalOrdenes').innerText = rows.CONTEO;
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar datos de la orden ' + error);
        document.getElementById('txtTotalDia').innerText = 'Q 0.00';
        document.getElementById('txtTotalOrdenes').innerText = 0;
        //document.getElementById('txtFecha').innerText = hoy;
    }


};

async function fcnCargarOrdenesFecha(idContainer){

    let f = new Date(document.getElementById('txtFecha').value); //new Date();
    let anio = f.getFullYear();
    let mes = f.getMonth()+1;
    let dia = f.getDate();
    
    try {
        const response = await fetch(`/carwash/ordenesfecha?token=${GlobalToken}&anio=${anio}&mes=${mes}&dia=${dia}`)
        const json = await response.json();
         
        let tblBody = json.recordset.map((rows)=>{
            return `<tr>
                <td>${rows.CORRELATIVO}
                <br>
                    <small><b>${rows.DIA + '/' + rows.MES + '/' + rows.ANIO}</b></small>
                </td>
                <td>${rows.NOPLACA}
                <br><small>${rows.DESMARCA}</small>
                </td>
                <td>${rows.NOMCLIENTE}</td>
                <td>${funciones.setMoneda(rows.TOTALTARJETA,'Q ')}</td>
                <td>${funciones.setMoneda(rows.TOTALEFECTIVO,'Q ')}</td>
                <td><b>${funciones.setMoneda(rows.IMPORTE,'Q ')}<b></td>
                <td>${rows.OBS}</td>
            </tr>`;                   
       }).join('\n');

       document.getElementById(idContainer).innerHTML = tblBody;

       //getTotalesDia();

    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
};