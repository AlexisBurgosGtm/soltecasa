funciones = {
    Confirmacion: function(msn){
        return swal({
            title: 'Confirme',
            text: msn,
            icon: 'warning',
            buttons: {
                cancel: true,
                confirm: true,
              }})
    },

    Aviso: function(msn){
        swal(msn, {
            timer: 1500,
            icon: "success",
            buttons: false
            });

        try {
            navigator.vibrate(500);
        } catch (error) {
            
        }
    },
    AvisoError: function(msn){
        swal(msn, {
            timer: 1500,
            icon: "error",
            buttons: false
            });
        try {
            navigator.vibrate([100,200,500]);
        } catch (error) {
            
        }
    },

    FiltrarListaProductos: function(idTabla){
        swal({
          text: 'Escriba para buscar...',
          content: "input",
          button: {
            text: "Buscar",
            closeModal: true,
          },
        })
        .then(name => {
          if (!name) throw null;
            funciones.FiltrarTabla(idTabla,name);

            //'tblProductosVentas'
        })
      },

      SumarATotal: function(idContainerTotal){
        swal({
          text: 'Precio por el/los servicios:',
          content: {
              element: "input",
              attributes :{
                 type : "number"
              }
          },
          button: {
            text: "Agregar",
            closeModal: true,
          },
        })
        .then(valor => {
          if (!valor) throw null;
            let c = document.getElementById(idContainerTotal)
            c.innerText = Number(valor);
            getTotalOrden();
            //'tblProductosVentas'
        })
      },

    setMoneda: function(num,signo) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents));
    },

    loadScript: function(url, idContainer) {
        return new Promise((resolve, reject) => {
          var script = document.createElement('script');
          //script.async = true;
          script.src = url;
    
          script.onload = resolve;
          script.onerror = reject;
             
          document.getElementById(idContainer).appendChild(script)
        });
    },
    loadCss: function(url, idContainer) {
        return new Promise((resolve, reject) => {
          var link = document.createElement('link');
          //script.async = true;
          link.href = url;
          link.rel = "stylesheet"
    
          link.onload = resolve;
          link.onerror = reject;
             
          document.getElementById(idContainer).appendChild(link)
        });
    },

    fetchData: (url)=>{
        fetch(url)
            .then(function(response) {
                return response.json();
                                    })
            .catch();
    },

    loadView: (url, idContainer)=> {
        return new Promise((resolve, reject) => {
            
            let contenedor = document.getElementById(idContainer);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'text';
            xhr.onload = function(e) {
      
              if (this.status == 200) {
                               
                var view = xhr.response;
                contenedor.innerHTML ='';
                contenedor.innerHTML = view;
                
                resolve();
      
              } else {
      
                reject();
      
              }
            }
      
            xhr.send();
      
          });
    },
   
	showNotification: function(from, align,msn, tipo){
        let stcolor = '';
        switch (tipo) {
            case 'error':
                stcolor = 'danger'
                break;
            case 'advertencia':
                stcolor = 'warning'
                break;
            case 'exito':
                stcolor = 'success'
                break;
            default:
                stcolor='primary'
                break;
        }

    	color = stcolor;

    	$.notify({
        	icon: "now-ui-icons ui-1_bell-53",
        	message: msn

        },{
            type: color,
            timer: 100,
            placement: {
                from: from,
                align: align
            }
        });
    },
    
    hablar: function(msn){
        var utterance = new SpeechSynthesisUtterance(msn);
        return window.speechSynthesis.speak(utterance); 
    },

    CompaniaTelefono: function(numero,hablado){
        var rangos = [[30000000,32289999,"TIGO"],
        [32290000,32299999,"CLARO"],
        [32300000,33099999,"TIGO"],
        [34000000,34499999,"MOVISTAR"],
        [40000000,40999999,"TIGO"],
        [41000000,42999999,"CLARO"],
        [43000000,44759999,"MOVISTAR"],
        [44760000,46999999,"TIGO"],
        [47000000,47729999,"CLARO"],
        [47730000,48199999,"TIGO"],
        [48200000,48219999,"UNITEL"],
        [48220000,50099999,"TIGO"],
        [50100000,50199999,"CLARO"],
        [50200000,50299999,"MOVISTAR"],
        [50300000,50699999,"TIGO"],
        [50700000,51099999,"MOVISTAR"],
        [51100000,51399999,"CLARO"],
        [51400000,51499999,"MOVISTAR"],
        [51500000,51999999,"TIGO"],
        [52000000,52099999,"TIGO"],
        [52100000,52999999,"MOVISTAR"],
        [53000000,53099999,"TIGO"],
        [53100000,53119999,"CLARO"],
        [53120000,53139999,"MOVISTAR"],
        [53140000,53899999,"TIGO"],
        [53900000,54099999,"MOVISTAR"],
        [54100000,54999999,"CLARO"],
        [55000000,55099999,"MOVISTAR"],
        [55100000,55179999,"CLARO"],
        [55180000,55199999,"MOVISTAR"],
        [55210000,55299999,"TIGO"],
        [55310000,55399999,"CLARO"],
        [55400000,55429999,"MOVISTAR"],
        [55430000,55449999,"CLARO"],
        [55450000,55499999,"MOVISTAR"],
        [55500000,55539999,"TIGO"],
        [55540000,55799999,"CLARO"],
        [55800000,55819999,"TIGO"],
        [55820000,55999999,"CLARO"],
        [56000000,56089999,"MOVISTAR"],
        [56100000,56399999,"CLARO"],
        [56400000,56899999,"MOVISTAR"],
        [56900000,56999999,"CLARO"],
        [57000000,57099999,"TIGO"],
        [57100000,57189999,"CLARO"],
        [57190000,57899999,"TIGO"],
        [57900000,57999999,"MOVISTAR"],
        [58000000,58099999,"TIGO"],
        [58100000,58189999,"CLARO"],
        [58190000,58199999,"TIGO"],
        [58200000,58799999,"CLARO"],
        [58800000,59099999,"TIGO"],
        [59100000,59149999,"CLARO"],
        [59150000,59179999,"MOVISTAR"],
        [59180000,59199999,"TIGO"],
        [59200000,59899999,"CLARO"],
        [59900000,59999999,"TIGO"]],

    lengthRangos = rangos.length;

    var num = numero;
    len = num.length; 
    nnum = parseInt(num,10);

    if (len == 8 ) {
    for (var i = lengthRangos - 1; i >= 0; i--) {
    if (rangos[i][0] <= nnum && nnum <= rangos[i][1]) {
        if (hablado=='SI'){     
            funciones.hablar("Su línea telefónica es " + rangos[i][2]);
        }else{
            return rangos[i][2];
        }
        found = true;
    }
    };

    if (!found) {
    if (hablado=='SI'){ 
        funciones.hablar("El número indicado no aparece en la lista");
    }else{
        return "No Disponible";
    }
    }

    } else {
    return "Ingrese 8 dígitos";
    }
 },

 crearBusquedaTabla: function(idTabla,idBusqueda){
    var tableReg = document.getElementById(idTabla);
    var searchText = document.getElementById(idBusqueda).value.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
  },

  FiltrarTabla: function(idTabla,filtro){
    var tableReg = document.getElementById(idTabla);
    var searchText = filtro.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
        funciones.scrollUp(1000, 'easing');
  },

  OcultarRows: function(idTabla){
    var tableReg = document.getElementById(idTabla);
        // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
        {
            if(i>15){
                tableReg.rows[i].style.display = 'none';
            }
        }
  },

   scrollUp: function(duration, easing) {
      window.scroll(0, 0);
  },

  PingInternet: async (url)=>{
    var peticion = new Request(url, {
        method: 'POST',
        headers: new Headers({
            // Encabezados
           'Content-Type': 'application/json'
        })
      });

      await fetch(peticion)
         .then(function(res) {
           if (res.status==200)
               {
                   funciones.hablar('parece que ya hay internet');
                }
      })
      .catch(
          ()=>{
            funciones.hablar('por lo visto no hay señal');
          }
      )
  },

  NotificacionPersistent : (msn)=>{

    const options = {
        body : "Nueva Orden generada",
        icon: "../favicon.png",
        vibrate: [1,2,3],
      }
      //image: "../favicon.png",
         if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
          console.log('Persistent Notification API not supported!');
          return;
        }
        
        try {
          navigator.serviceWorker.getRegistration()
            .then(reg => 
                    reg.showNotification(msn, options)
                )
            .catch(err => console.log('Service Worker registration error: ' + err));
        } catch (err) {
          console.log('Notification API error: ' + err);
        }
      
  }

};
