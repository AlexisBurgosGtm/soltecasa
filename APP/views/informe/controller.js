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
            document.getElementById('lbFecha').innerHTML = `<b>${rows.FECHA.replace('T00:00:00.000Z','')}</b>`
            document.getElementById('lbNomCliente').innerText = rows.CLIENTE
            document.getElementById('lbProyecto').innerText = rows.PROYECTO
            document.getElementById('lbDirProyecto').innerText = rows.DIRPROYECTO
            document.getElementById('lbAtencion').innerText = rows.CONTACTO
            
       }).join('\n');
       
    } catch (error) {
        console.log(error)
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
    };

    // SOLICITANDO LA TABLA DE PROMEDIOS
    let labels = [];
    let dataset = [];
    try {
            const response = await fetch(`/reports/promediosalcanzados?orden=${noOrden}`)
            const json = await response.json();
            let strPromedios = json.recordset.map((rows)=>{
                
                let resist =rows.RESISTENCIAMPA; if (rows.RESISTENCIAMPA==null){resist = 0};
                let equival =rows.EQUIVALENCIAPSI; if (rows.EQUIVALENCIAPSI==null){equival = 0};
                let alcan =rows.ALCANZADO; if (rows.ALCANZADO==null){alcan = 0};
                labels.push(rows.EDAD.toString());
                dataset.push(alcan);

                return `<tr>
                <td>${rows.EDAD}</td>
                <td>${rows.FECHA.replace('T00:00:00.000Z','')}</td>
                <td>${resist}</td>
                <td>${equival}</td>
                <td>${alcan} %</td>
            </tr>`
    
           }).join('\n');
          
            document.getElementById('tblPromedios').innerHTML = strPromedios;
    
    } catch (error) {
            console.log(error)
    };
    
    // CARGANDO DATOS DE LA GRAFICA
    var data = {
            labels: labels,
            datasets: [{
              label: '% alcanzado',
              data: dataset,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: false
            }]
          };

    var options = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            legend: {
              display: false
            },
            elements: {
              point: {
                radius: 0
              }
            }
    };

    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    var barChart = new Chart(barChartCanvas, {type: 'bar', data: data, options: options});
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