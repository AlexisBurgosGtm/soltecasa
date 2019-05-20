async function getTotalesDia(){
    let f = new Date();
    let hoy = f.toDateString();
    let anio = f.getFullYear();
    let mes = f.getMonth()+1;
    let dia = f.getDate();

    try {
        const response = await fetch(`/carwash/totaldia?token=${GlobalToken}&anio=${anio}&mes=${mes}&dia=${dia}`)
        const json = await response.json();
                       
        json.recordset.map((rows)=>{
            document.getElementById('txtTotalDia').innerText = funciones.setMoneda(rows.IMPORTE, 'Q ');
            document.getElementById('txtTotalOrdenes').innerText = rows.CONTEO;
            document.getElementById('txtFecha').innerText = hoy;
            //document.getElementById('txtTotalOrdenes').innerText = rows.CONTEO;
       }).join('\n');
     
    } catch (error) {
        console.log('Error al cargar datos de la orden ' + error);
        document.getElementById('txtTotalDia').innerText = 'Q 0.00';
        document.getElementById('txtTotalOrdenes').innerText = 0;
        document.getElementById('txtFecha').innerText = hoy;
    }


};