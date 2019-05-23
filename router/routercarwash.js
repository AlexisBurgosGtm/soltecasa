const express = require('express');
const router = express.Router();

const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'CARWASH', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

//const sqlString = 'mssql://' + config.user + ':' + config.password + '@' + config.server + '/' + config.database;

// OBTIENE EL TOTAL DE VENTAS DEL DIA
router.get("/totaldia", async(req,res)=>{
	const sql = require('mssql')
	
	let _dia = req.query.dia;
	let _mes = req.query.mes;
	let _anio = req.query.anio;
	let token = req.query.token;

	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT COUNT(CORRELATIVO) AS CONTEO, SUM(IMPORTE) AS IMPORTE, SUM(TOTALTARJETA) AS TARJETA, SUM(TOTALEFECTIVO) AS EFECTIVO
											FROM CW_ORDERS
											WHERE (STATUS = 'F') AND (ANIO = ${_anio}) AND (MES = ${_mes}) AND (DIA = ${_dia})`
				console.dir('Enviando total dia');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// OBTIENE TODAS LAS ORDENES PENDIENTES
router.get("/ordenespendientes", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	let st = req.query.st;

	try {
		sql.close()
	} catch (error) {
		
	}
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT CW_ORDERS.CORRELATIVO, CW_ORDERS.NOPLACA, CW_MARCAS.DESMARCA, CW_CLIENTES.COLOR, CW_CLIENTES.TELEFONO, CW_ORDERS.NOMCLIENTE, CW_ORDERS.IMPORTE, CW_ORDERS.ANIO, CW_ORDERS.MES, CW_ORDERS.DIA
												FROM CW_MARCAS RIGHT OUTER JOIN CW_CLIENTES ON CW_MARCAS.CODMARCA = CW_CLIENTES.CODMARCA RIGHT OUTER JOIN
												CW_ORDERS ON CW_CLIENTES.NOPLACA = CW_ORDERS.NOPLACA LEFT OUTER JOIN CW_CATEGORIAS ON CW_ORDERS.CODCATEGORIA = CW_CATEGORIAS.CODCATEGORIA
												WHERE (CW_ORDERS.STATUS = ${st})`
				console.dir('Enviando ordenes pendientes');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// OBTIENE EL DETALLE DE LA ORDEN
router.get("/datosorden", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	let correlativo = req.query.correlativo;

	try {
		sql.close()
	} catch (error) {
		
	}

			const pool = await sql.connect(config)		
			try {
				const result = await sql.query `SELECT CW_ORDERS.CORRELATIVO, CW_ORDERS.NOPLACA, CW_MARCAS.DESMARCA, CW_CLIENTES.COLOR, CW_CATEGORIAS.DESCATEGORIA, CW_ORDERS.IMPORTE, CW_ORDERS.STATUS, CW_ORDERS.RETOQUE, CW_ORDERS.AROMA, 
												CW_ORDERS_DETAILS.CODPROD, CW_ORDERS_DETAILS.DESCRIPCION, CW_ORDERS_DETAILS.IMPORTE AS IMPORTEPRODUCTO, CW_CLIENTES.NOMCLIENTE, CW_CLIENTES.TELEFONO
												FROM CW_ORDERS_DETAILS RIGHT OUTER JOIN
												CW_ORDERS ON CW_ORDERS_DETAILS.MES = CW_ORDERS.MES AND CW_ORDERS_DETAILS.ANIO = CW_ORDERS.ANIO AND CW_ORDERS_DETAILS.CORRELATIVO = CW_ORDERS.CORRELATIVO LEFT OUTER JOIN
												CW_MARCAS RIGHT OUTER JOIN CW_CLIENTES ON CW_MARCAS.CODMARCA = CW_CLIENTES.CODMARCA ON CW_ORDERS.NOPLACA = CW_CLIENTES.NOPLACA LEFT OUTER JOIN
												CW_CATEGORIAS ON CW_ORDERS.CODCATEGORIA = CW_CATEGORIAS.CODCATEGORIA
												WHERE (CW_ORDERS.CORRELATIVO = ${correlativo})`
				console.dir('Enviando datos de la orden no. ' + correlativo);
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// OBTIENE LOS DATOS DEL CLIENTE SEGUN LA PLACA
router.get("/datoscliente", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	let noplaca = req.query.noplaca;

	try {sql.close()} catch (error) {}

			const pool = await sql.connect(config)		
			try {
				const result = await sql.query `SELECT NOMCLIENTE, TELEFONO, CODMARCA, COLOR
												FROM CW_CLIENTES
												WHERE (NOPLACA = ${noplaca})`
				console.dir('Enviando datos del cliente');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// FINALIZA UNA ORDEN PENDIENTE
router.put("/finalizarorden", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let correlativo = req.body.correlativo;
	let tarjeta = Number(req.body.tarjeta);
	let efectivo = Number(req.body.efectivo);
	let obs = req.body.obs;
	let token = req.body.token;
		
	let sqlQry = `update CW_orders set status='F', totaltarjeta=${tarjeta}, totalefectivo=${efectivo}, obs='${obs}' where correlativo=${correlativo}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Orden finalizada exitosamente')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log('Error al finalizar: ' + err)
		})
});
// CAMBIA EL STATUS DE UNA ORDEN A PENDIENTE
router.put("/reactivarorden", async(req,res)=>{

	const sql = require('mssql')
	try {sql.close()} catch (error) {}
	
	let correlativo = req.body.correlativo;
	let token = req.body.token;
		
	let sqlQry = `update CW_orders set status='P' where correlativo=${correlativo}`

		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Orden Activada exitosamente')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
		})
});
// INSERTA UNA NUEVA ORDEN
router.post("/nuevaorden", async(req,res)=>{
	const sql = require('mssql')
	try {sql.close()} catch (error) {};

	let _correlativo = Number(req.body.correlativo);
	let _anio = req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	let _fecha = new Date(_anio,_mes,_dia);
	let _noplaca = req.body.noplaca;
	let _importe = Number(req.body.importe);
	let _retoque = req.body.retoque;
	let _aroma = req.body.aroma;
	let _telefono = req.body.telefono;
	let _codmarca = parseInt(req.body.codmarca);
	//let _obs = req.body.obs;

	let _nomcliente = req.body.nomcliente;
	let _color = req.body.colorv;
	console.log('var color : '+_color)
		
	var sqlQry = 'INSERT INTO CW_ORDERS (CORRELATIVO,FECHA,ANIO,MES,DIA,STATUS,NOPLACA,IMPORTE,CODCATEGORIA,RETOQUE,AROMA,NOMCLIENTE,TOTALEFECTIVO,TOTALTARJETA) VALUES (@CORRELATIVO,@FECHA,@ANIO,@MES,@DIA,@STATUS,@NOPLACA,@IMPORTE,@CODCATEGORIA,@RETOQUE,@AROMA,@NOMCLIENTE,0,0)'
		
	let pool = await sql.connect(config)
		// INSERTA EL CLIENTE COMO NUEVO O ACTUALIZA SI YA EXISTE
		let descrip = ' ';
		try {
				const result3  = await sql.query `INSERT INTO CW_CLIENTES (NOPLACA,CODMARCA,COLOR,NOMCLIENTE,TELEFONO,DESCRIPCION) VALUES (${_noplaca},${_codmarca},${_color},${_nomcliente},${_telefono},${descrip})`
				console.dir('Cliente nuevo ingresado exitosamente');
		} catch (err) {
				//await sql.connect(config)
				const result3  = await sql.query `UPDATE CW_CLIENTES SET 
							CODMARCA=${_codmarca},COLOR=${_color},NOMCLIENTE=${_nomcliente},TELEFONO=${_telefono},DESCRIPCION=${descrip}
							WHERE NOPLACA=${_noplaca}`
				console.dir('Cliente actualizado exitosamente');
				//res.send(result2);
		}
		// INSERTA LA NUEVA ORDEN
		try {
			let result1 = await pool.request()
				.input('CORRELATIVO', sql.Float, _correlativo)
				.input('FECHA', sql.Date, _fecha)
				.input('ANIO', sql.Int, _anio)
				.input('MES', sql.Int, _mes)
				.input('DIA', sql.Int, _dia)
				.input('STATUS', sql.VarChar(2), 'P')
				.input('NOPLACA', sql.VarChar(15), _noplaca)
				.input('IMPORTE', sql.Float, _importe)
				.input('CODCATEGORIA', sql.Int, 0)
				.input('RETOQUE', sql.VarChar(20), _retoque)
				.input('AROMA', sql.VarChar(20), _aroma)
				.input('NOMCLIENTE', sql.VarChar(150), _nomcliente)
				.query(sqlQry)
				if (result1.rowsAffected){
					res.send('Ingresada exitosamente')
				}
				
			//console.dir(result1)
					
		} catch (err) {
			// ... error checks
			console.log(err);
		}
		// ACTUALIZA EL CORRELATIVO
		try {
			let nuevocorrelativo = _correlativo +1;
			const result  = await sql.query `UPDATE CW_TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE CODDOC='ORDEN'`
			console.dir('Correlativo actualizado con exito');
			
		} catch (err) {
			console.log('Error al actualizar correlativo : ' + String(err));
		}
		 
	sql.on('error', err => {
		// ... error handler
		console.log('error sql: ' + err.toString())
	})

});
// INSERTA ORDEN DETALLES
router.post("/nuevaorden_detalle", async(req,res)=>{
	//const sql = require('mssql')
	//try {sql.close()} catch (error) {};

alert(req.body.codprod);

	
	/*
	var sqlQry = 'INSERT INTO CW_ORDERS (CORRELATIVO,FECHA,ANIO,MES,DIA,STATUS,NOPLACA,IMPORTE,CODCATEGORIA,RETOQUE,AROMA,NOMCLIENTE,TOTALEFECTIVO,TOTALTARJETA) VALUES (@CORRELATIVO,@FECHA,@ANIO,@MES,@DIA,@STATUS,@NOPLACA,@IMPORTE,@CODCATEGORIA,@RETOQUE,@AROMA,@NOMCLIENTE,0,0)'
	
	
	let pool = await sql.connect(config)
	
		// INSERTA LA NUEVA ORDEN
		try {
			let result1 = await pool.request()
				.input('CORRELATIVO', sql.Float, _correlativo)
				.input('FECHA', sql.Date, _fecha)
				.input('ANIO', sql.Int, _anio)
				.input('MES', sql.Int, _mes)
				.input('DIA', sql.Int, _dia)
				.input('STATUS', sql.VarChar(2), 'P')
				.input('NOPLACA', sql.VarChar(15), _noplaca)
				.input('IMPORTE', sql.Float, _importe)
				.input('CODCATEGORIA', sql.Int, 0)
				.input('RETOQUE', sql.VarChar(20), _retoque)
				.input('AROMA', sql.VarChar(20), _aroma)
				.input('NOMCLIENTE', sql.VarChar(150), _nomcliente)
				.query(sqlQry)
				if (result1.rowsAffected){
					res.send('Ingresada exitosamente')
				}
				
			//console.dir(result1)
					
		} catch (err) {
			// ... error checks
			console.log(err);
		}
		// ACTUALIZA EL CORRELATIVO
		try {
			let nuevocorrelativo = _correlativo +1;
			const result  = await sql.query `UPDATE CW_TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE CODDOC='ORDEN'`
			console.dir('Correlativo actualizado con exito');
			
		} catch (err) {
			console.log('Error al actualizar correlativo : ' + String(err));
		}
		 
	sql.on('error', err => {
		// ... error handler
		console.log('error sql: ' + err.toString())
	})
*/

});
// ELIMINA COMPLETAMENTE UNA ORDEN
router.delete("/eliminarorden", async(req,res)=>{

	const sql = require('mssql')
	try {sql.close()} catch (error) {}
	
	let correlativo = req.body.correlativo;
	let token = req.body.token;
		
	let sqlQry = `delete from cw_orders where correlativo=${correlativo}`

		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Orden Eliminada exitosamente')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
		})
});
// OBTIENE EL CORRELATIVO DE LA ORDEN
router.get("/ordencorrelativo", async(req,res)=>{
	const sql = require('mssql')
	try {sql.close()} catch (error) {};
	let token = req.query.token;
	
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT CORRELATIVO FROM CW_TIPODOCUMENTOS WHERE CODDOC='ORDEN'`
				console.dir('Enviando correlativo de ordenes');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// ACTUALIZA EL CORRELATIVO DE LA ORDEN
router.put("/ordencorrelativo", async(req,res)=>{
	const sql = require('mssql')
	//let token = req.query.token;
	let correlativo = Number(req.body.correlativo)+1;
	console.log('Nuevo correlativo ' + correlativo);
	//try {sql.close()} catch (error) {}
			//const pool = await new sql.connect(config)		
			try {
				const result  = await sql.query `UPDATE CW_TIPODOCUMENTOS SET CORRELATIVO=${correlativo} WHERE CODDOC='ORDEN'`
				console.dir('Correlativo actualizado con exito');
				res.send(result);
			} catch (err) {
				console.log('Error al actualizar correlativo : ' + String(err));
			}
			//sql.close()
});
// OBTIENE LOS SERVICIOS POR CATEGORIA
router.get("/servicios", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	try {sql.close()} catch (error) {};
	
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT CODPROD,DESCRIPCION,IMPORTE,CODCATEGORIA FROM CW_SERVICIOS`
				console.dir('Enviando correlativo de ordenes');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
	sql.close()
			
});
// OBTIENE LAS MARCAS DE LOS VEHICULOS
router.get("/marcas", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	try {sql.close()} catch (error) {};
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT CODMARCA,DESMARCA FROM CW_MARCAS`
				console.dir('Enviando marcas..');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
	sql.close()
});
// OBTIENE LAS MARCAS DE LOS VEHICULOS
router.get("/aromas", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	try {sql.close()} catch (error) {};
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT DESCRIPCION FROM CW_AROMAS`
				console.dir('Enviando aromas..');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
	sql.close()
});

module.exports = router;