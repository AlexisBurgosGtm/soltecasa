const express = require('express');
const router = express.Router();
const execute = require('./connection');

// OBTIENE EL TOTAL DE VENTAS DEL DIA
router.get("/rptinforme", async(req,res)=>{
	let noOrden = req.query.orden;
  
  console.log('ejecutando informe ' & noOrden);

	let qr = `SELECT Ordenes_trabajo_Det.Identificacion as IDENTIFICACION, Ordenes_trabajo_Det.Fecha_Rotura AS ROTURA, Ordenes_trabajo_Res.CodClientePrin AS CODCLIENTE, Ordenes_trabajo_Res.Proyecto, Ordenes_trabajo_Res.Direccion_Proyecto AS DIRECCION, Ordenes_trabajo_Res.Contacto, Ordenes_trabajo_Det.No_orden AS NOORDEN, Ordenes_trabajo_Det.Laboratorista, Ordenes_trabajo_Det.Colocacion, Ordenes_trabajo_Det.Fecha_Manufactura AS MANUFACTURA, Ordenes_trabajo_Det.[#Guia] AS GUIA, Ordenes_trabajo_Det.Resistencia_Req AS RESISTENCIAR, Ordenes_trabajo_Det.Vol_M3 AS VOLUMEN, Ordenes_trabajo_Det.Hora_Inicio AS HINICIO, Ordenes_trabajo_Det.Hora_final AS HFINAL, Ordenes_trabajo_Det.[Slump(plg)] AS PLG, Ordenes_trabajo_Det.[Peso_Planta(kg/m3)] AS PESOPLANTA, Ordenes_trabajo_Det.[Temperatura_Concreto(Cent)] AS TEMPERATURA, Ordenes_trabajo_Det.[%Aire] AS AIRE, Ordenes_trabajo_Det.[Peso_Unitario(kg/m3)] AS PESOUNITARIO, Ordenes_trabajo_Det.[Temperatura_Ambiente(Cent)] AS TEMPERATURAAMBIENTE, Ordenes_trabajo_Det.Hora_Hechura AS HORAHECHURA, Ordenes_trabajo_Det.Rendimiento, Ordenes_trabajo_Det.[Peso(Kg)] AS PESOKG, Ordenes_trabajo_Det.[Diametro(cm)] AS DIAMETRO, Ordenes_trabajo_Det.[Carga_Soportada(kN)] AS CARGASOPORTADA, Ordenes_trabajo_Det.Tipo_Rotura AS TIPOROTURA, Ordenes_trabajo_Res.Firma1, Ordenes_trabajo_Res.Firma2, Ordenes_trabajo_Det.LaboratoristaEnsayo, Ordenes_trabajo_Det.Elemento, Ordenes_trabajo_Det.[Edad_rotura(dias)] EDADROTURA, Clientes.Nombre AS Cliente, Ordenes_trabajo_Det.Area, Ordenes_trabajo_Det.AreaTag, ([Carga_Soportada(kN)]*10/([Diametro(cm)]*[Diametro(cm)]*Pi()/4)) AS RESISTENCIACOMPRESION, ([Carga_Soportada(kN)]*10/([Diametro(cm)]*[Diametro(cm)]*Pi()/4))*145.0377 AS EquivalenciaPsi, Ordenes_trabajo_Det.TipoCostoCilindro, Costo_Cilindro.TipoCilindro
  FROM ((Ordenes_trabajo_Res INNER JOIN Ordenes_trabajo_Det ON Ordenes_trabajo_Res.No_orden = Ordenes_trabajo_Det.No_orden) LEFT JOIN Clientes ON Ordenes_trabajo_Res.CodClientePrin = Clientes.[Codigo/Nit]) LEFT JOIN Costo_Cilindro ON Ordenes_trabajo_Det.TipoCostoCilindro = Costo_Cilindro.IdCosto
  GROUP BY Ordenes_trabajo_Det.Identificacion, Ordenes_trabajo_Det.Fecha_Rotura, Ordenes_trabajo_Res.CodClientePrin, Ordenes_trabajo_Res.Proyecto, Ordenes_trabajo_Res.Direccion_Proyecto, Ordenes_trabajo_Res.Contacto, Ordenes_trabajo_Det.No_orden, Ordenes_trabajo_Det.Laboratorista, Ordenes_trabajo_Det.Colocacion, Ordenes_trabajo_Det.Fecha_Manufactura, Ordenes_trabajo_Det.[#Guia], Ordenes_trabajo_Det.Resistencia_Req, Ordenes_trabajo_Det.Vol_M3, Ordenes_trabajo_Det.Hora_Inicio, Ordenes_trabajo_Det.Hora_final, Ordenes_trabajo_Det.[Slump(plg)], Ordenes_trabajo_Det.[Peso_Planta(kg/m3)], Ordenes_trabajo_Det.[Temperatura_Concreto(Cent)], Ordenes_trabajo_Det.[%Aire], Ordenes_trabajo_Det.[Peso_Unitario(kg/m3)], Ordenes_trabajo_Det.[Temperatura_Ambiente(Cent)], Ordenes_trabajo_Det.Hora_Hechura, Ordenes_trabajo_Det.Rendimiento, Ordenes_trabajo_Det.[Peso(Kg)], Ordenes_trabajo_Det.[Diametro(cm)], Ordenes_trabajo_Det.[Carga_Soportada(kN)], Ordenes_trabajo_Det.Tipo_Rotura, Ordenes_trabajo_Res.Firma1, Ordenes_trabajo_Res.Firma2, Ordenes_trabajo_Det.LaboratoristaEnsayo, Ordenes_trabajo_Det.Elemento, Ordenes_trabajo_Det.[Edad_rotura(dias)], Clientes.Nombre, Ordenes_trabajo_Det.Area, Ordenes_trabajo_Det.AreaTag, Ordenes_trabajo_Det.TipoCostoCilindro, Costo_Cilindro.TipoCilindro
  HAVING (Ordenes_trabajo_Det.No_orden='${noOrden}')`
  
  console.log(qr);

	execute.Query(res,qr);

});

// OBTIENE LAS ORDENES DE UN CLIENTE ESPECIFICO

router.get("/ordenesmes", async(req,res)=>{
  const {codcliente,anio,mes} = req.query;

  let qry = `SELECT NO_ORDEN AS ORDEN,FECHA,PROYECTO,DIRECCION_PROYECTO AS DIRECCION,TERMINADA AS ST,ANIO,MES FROM Ordenes_trabajo_Res WHERE CODCLIENTEPRIN='${codcliente}' and ANIO=${anio} AND MES=${mes} ORDER BY NO_ORDEN`
  execute.Query(res,qry);

});

router.get("/elementosorden", async(req,res)=>{
  const orden = req.query.orden;

  let qry = `SELECT IDENTIFICACION,FECHA_MANUFACTURA AS MANUFACTURA,FECHA_ROTURA AS ROTURA,ELEMENTO, [Edad_rotura(dias)] AS EDAD FROM Ordenes_trabajo_Det WHERE NO_ORDEN='${orden}' ORDER BY IDENTIFICACION`
  console.log(qry);
  execute.Query(res,qry);

});


module.exports = router;
