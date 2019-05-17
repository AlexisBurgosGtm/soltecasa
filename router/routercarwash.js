const express = require('express');
const router = express.Router();

const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'CARWASH', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};
const sqlString = 'mssql://' + config.user + ':' + config.password + '@' + config.server + '/' + config.database;

// OBTIENE TODAS LAS ORDENES PENDIENTES
router.get("/ordenespendientes", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	let st = req.query.st;
			const pool = await new sql.connect(config)		
			try {
				const result = await sql.query `SELECT CW_ORDERS.CORRELATIVO, CW_ORDERS.NOPLACA, CW_MARCAS.DESMARCA, CW_CLIENTES.COLOR, CW_CATEGORIAS.DESCATEGORIA, CW_ORDERS.IMPORTE
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

			const pool = await sql.connect(config)		
			try {
				const result = await sql.query `SELECT CW_ORDERS.CORRELATIVO, CW_ORDERS.NOPLACA, CW_MARCAS.DESMARCA, CW_CLIENTES.COLOR, CW_CATEGORIAS.DESCATEGORIA, CW_ORDERS.IMPORTE, CW_ORDERS.STATUS, CW_ORDERS.RETOQUE, CW_ORDERS.AROMA, 
												CW_ORDERS_DETAILS.CODPROD, CW_ORDERS_DETAILS.DESCRIPCION, CW_ORDERS_DETAILS.IMPORTE AS IMPORTEPRODUCTO, CW_CLIENTES.NOMCLIENTE
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
// FINALIZA UNA ORDEN PENDIENTE
router.put("/finalizarorden", async(req,res)=>{

	const sql = require('mssql')
	
	let correlativo = req.body.correlativo;
	let token = req.body.token;
		
	let sqlQry = `update CW_orders set status='F' where correlativo=${correlativo}`

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
		})
});
// CAMBIA EL STATUS DE UNA ORDEN A PENDIENTE
router.put("/reactivarorden", async(req,res)=>{

	const sql = require('mssql')
	
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
	
	let _correlativo = req.body.correlativo;
	let _anio = req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	let _noplaca = req.body.noplaca;
	let _importe = Number(req.body.importe);
	let _retoque = req.body.retoque;
	let _aroma = req.body.aroma;
	let _nomcliente = req.body.nomcliente;
	let _color = req.body.color;
	let _telefono = req.body.telefono;
	let _codmarca = req.body.codmarca;

	let token = req.body.token;
		
	let sqlQry = 'insert into CW_orders (correlativo,anio,mes,dia,status,noplaca,importe,codcategoria,retoque,aroma) values (@correlativo,@anio,@mes,@dia,@status,@noplaca,@importe,@codcategoria,@retoque,@aroma)'
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			.input('correlativo', sql.Float, _correlativo)
			.input('anio', sql.Int, _anio)
			.input('mes', sql.Int, _mes)
			.input('dia', sql.Int, _dia)
			.input('status', sql.VarChar(2), 'P')
			.input('noplaca', sql.VarChar(10), _noplaca)
			.input('importe', sql.Float, _importe)
			.input('codcategoria', sql.Int, 0)
			.input('retoque', sql.VarChar(50), _retoque)
			.input('aroma', sql.VarChar(50), _aroma)
      		 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Orden Generada exitosamente')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log(err.toString())
		})
});
// OBTIENE EL CORRELATIVO DE LA ORDEN
router.get("/ordencorrelativo", async(req,res)=>{
	const sql = require('mssql')
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
	let token = req.query.token;
	let correlativo = Number(req.query.correlativo)+1;
	
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query `UPDATE CW_TIPODOCUMENTOS SET CORRELATIVO=${correlativo} WHERE CODDOC='ORDEN'`
				console.dir('Enviando update correlativo');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});
// OBTIENE LOS SERVICIOS POR CATEGORIA
router.get("/servicios", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	
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

module.exports = router;