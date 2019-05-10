const express = require('express');

const router = express.Router();

//const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'ARES_SYNC', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

const sqlString = 'mssql://' + config.user + ':' + config.password + '@' + config.server + '/' + config.database;

router.get("/admin/ventasdiarias", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	let anio = req.query.anio;
	let mes = req.query.mes;

			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT FECHA,DIA, concat('Q',TOTALCOSTO) AS TOTALCOSTO, concat('Q',TOTALVENTA) AS TOTALVENTA, concat('Q',UTILIDAD) AS UTILIDAD, UTILIDADPORC,LASTUPDATE FROM WEB_VENTASDIARIAS WHERE TOKEN=${token} AND ANIO=${anio} AND MES=${mes}`
				console.dir('Enviando ventas diarias');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// OBTIENE TODAS LAS EMPRESAS
router.get("/empresas/all", async(req,res)=>{

	const sql = require('mssql')
	let token = req.query.token;

	const pool = await sql.connect(sqlString)
	try {
		//const pool = await sql.connect(sqlString)
		const result = await sql.query`SELECT EMPNIT,EMPNOMBRE FROM EMPRESAS WHERE TOKEN=${token} ORDER BY EMPNOMBRE`
		console.dir('Empresas cargadas exitosamente token ' + token);
	
		res.send(result);
		
	} catch (err) {
		console.log(String(err));
	}
	sql.close()
});

//OBTIENE LAS VENTAS POR DIA Y VENDEDOR
router.get("/ventas/dia", async(req,res)=>{
	
	const sql = require('mssql')
	let token = req.query.token;
	/*
	const pool = await sql.connect(sqlString)
	try {
		const result = await sql.query`SELECT ANIO,MES,DIA,CODVEN,NOMVEN,VENTA,EMPNIT FROM VENTAS_DIA_VENDEDOR WHERE TOKEN=${token}`
		console.dir('Generado Ventas por vendedor por día');
		res.send(result);
	} catch (err) {
		console.log(String(err));
	}
	sql.close()*/
});

//OBTIENE LA LISTA DE PRODUCTOS Y PRECIOS CON EXISTENCIA
router.get("/productos/all", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT CODPROD,DESPROD,DESMARCA,CODMEDIDA,EQUIVALE,COSTO,PRECIO,concat('Q',PRECIO) as QPRECIO, EXISTENCIA, EMPNIT FROM PRECIOS WHERE TOKEN=${token}`
				console.dir('Productos cargados');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

//OBTIENE LA LISTA DE PRODUCTOS CON EXISTENCIA ÚNICA
router.get("/productos/inventario", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT CODPROD, DESPROD, EXISTENCIA, LASTUPDATE FROM PRECIOS GROUP BY TOKEN, EMPNIT, CODPROD, DESPROD, EXISTENCIA, LASTUPDATE HAVING (TOKEN = ${token})`
				console.dir('Existencias cargadas');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// OBTIENE TODOS LOS CLIENTES DE LA TABLA
router.get("/clientes/all", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;

	const pool = await sql.connect(sqlString)
	try {
		const result = await sql.query`SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE, MUNICIPIOS.DESMUNICIPIO, DEPARTAMENTOS.DESDEPARTAMENTO, CLIENTES.TELEFONOS, CLIENTES.SALDO, CLIENTES.EMPNIT
									FROM CLIENTES LEFT OUTER JOIN DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPARTAMENTO LEFT OUTER JOIN
								 				MUNICIPIOS ON CLIENTES.CODMUNICIPIO = MUNICIPIOS.CODMUNICIPIO
									WHERE (CLIENTES.TOKEN=${token})`
		console.dir('CLIENTES cargados');
		
		res.send(result);
	} catch (err) {
		console.log(String(err));
	}
	sql.close()
});

//OBTIENE LA LISTA DE REPARTIDORES
router.get("/reparto/repartidores/all", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT EMPNIT,CODREP,NITREP,DESREP,DIRREP,TELREP,CONTACTO,TELCONTACTO,EMAIL,WHATSAPP,CLAVE FROM REPARTIDORES WHERE TOKEN=${token}`
				console.dir('Repartidores cargados...');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

router.get("/reparto/usuarios/login", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	
		const pool = await sql.connect(sqlString)
		try {
			const result = await sql.query`SELECT EMPNIT,CODREP,DESREP,CLAVE FROM REPARTIDORES WHERE TOKEN=${token}`
			console.dir('La consulta usuario se generó');
			res.send(result);
		
		} catch (err) {
			// ... error checks
			res.send('Denegado');
			console.log('Error en la consulta usuarios');
		}
		sql.close()
});

router.get("/reparto/enviospendientes", async(req,res)=>{
	const sql = require('mssql');
	let token = req.query.token
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT WEB_DOCUMENTOS.EMPNIT, WEB_DOCUMENTOS.CODDOC, WEB_DOCUMENTOS.CORRELATIVO, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE,CLIENTES.TELEFONOS,WEB_DOCUMENTOS.TOTALVENTA, concat('Q',WEB_DOCUMENTOS.TOTALVENTA) as QPRECIO, WEB_DOCUMENTOS.CODREP, 
												REPARTIDORES.DESREP, WEB_DOCUMENTOS.ENTREGADO FROM WEB_DOCUMENTOS LEFT OUTER JOIN
												REPARTIDORES ON WEB_DOCUMENTOS.CODREP = REPARTIDORES.CODREP AND WEB_DOCUMENTOS.EMPNIT = REPARTIDORES.EMPNIT AND 
												WEB_DOCUMENTOS.TOKEN = REPARTIDORES.TOKEN LEFT OUTER JOIN
												CLIENTES ON WEB_DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE AND WEB_DOCUMENTOS.EMPNIT = CLIENTES.EMPNIT AND WEB_DOCUMENTOS.TOKEN = CLIENTES.TOKEN
												WHERE (WEB_DOCUMENTOS.ENTREGADO = 'NO') AND (WEB_DOCUMENTOS.TOKEN=${token})`
				console.dir('Envios pendientes Cargados...');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

router.get("/reparto/enviosentregados", async(req,res)=>{
	const sql = require('mssql');
	let token = req.query.token
			const pool = await sql.connect(config)		
			try {
				const result = await sql.query`SELECT WEB_DOCUMENTOS.EMPNIT, WEB_DOCUMENTOS.CODDOC, WEB_DOCUMENTOS.CORRELATIVO, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE,CLIENTES.TELEFONOS,WEB_DOCUMENTOS.TOTALVENTA, concat('Q',WEB_DOCUMENTOS.TOTALVENTA) as QPRECIO, WEB_DOCUMENTOS.CODREP, 
												REPARTIDORES.DESREP, WEB_DOCUMENTOS.ENTREGADO FROM WEB_DOCUMENTOS LEFT OUTER JOIN
												REPARTIDORES ON WEB_DOCUMENTOS.CODREP = REPARTIDORES.CODREP AND WEB_DOCUMENTOS.EMPNIT = REPARTIDORES.EMPNIT AND 
												WEB_DOCUMENTOS.TOKEN = REPARTIDORES.TOKEN LEFT OUTER JOIN
												CLIENTES ON WEB_DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE AND WEB_DOCUMENTOS.EMPNIT = CLIENTES.EMPNIT AND WEB_DOCUMENTOS.TOKEN = CLIENTES.TOKEN
												WHERE (WEB_DOCUMENTOS.ENTREGADO = 'SI') AND (WEB_DOCUMENTOS.TOKEN=${token})`
				console.dir('Envios pendientes Cargados...');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

router.post("/reparto/marcarenviado", async(req,res)=>{
	const sql = require('mssql');
	let token = req.body.token;
	let empnit = req.body.empnit;
	let coddoc = req.body.coddoc;
	let correlativo = Number(req.body.correlativo);

	let sqlQry = `UPDATE WEB_DOCUMENTOS SET ENTREGADO='SI' WHERE TOKEN='${token}' AND EMPNIT='${empnit}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}`
	
	const pool1 = await new sql.ConnectionPool(config, err => {
		// ... error checks
				 
		// Query
		 pool1.request() // or: new sql.Request(pool1)
		 //.input('entregado', sql.VarChar(2), 'NO')
		 .query(sqlQry, (err, result) => {
			if (result.rowsAffected){
				res.send('Ingreso exitoso')
			}
		});
		//sql.close()
		//pool1.release();
 
	})
	 
	pool1.on('error', err => {
		// ... error handler
	})

});

router.post("/reparto/marcarnoenviado", async(req,res)=>{
	const sql = require('mssql');
	
	let token = req.body.token;
	let empnit = req.body.empnit;
	let coddoc = req.body.coddoc;
	let correlativo = Number(req.body.correlativo);

	let sqlQry = `UPDATE WEB_DOCUMENTOS SET ENTREGADO='NO' WHERE TOKEN='${token}' AND EMPNIT='${empnit}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}`

			//const pool = await sql.connect(sqlString)
			const pool1 = await new sql.ConnectionPool(config, err => {
				// ... error checks
						 
				// Query
				 pool1.request() // or: new sql.Request(pool1)
				 //.input('entregado', sql.VarChar(2), 'NO')
				 .query(sqlQry, (err, result) => {
					if (result.rowsAffected){
						res.send('Ingreso exitoso')
					}
				});
				//sql.close()
				//pool1.release();
		 
			})
			 
			pool1.on('error', err => {
				// ... error handler
			})



});

// OBTIENE LA LISTA DE VENDEDORES
router.get("/usuarios/login", async(req,res)=>{
	const sql = require('mssql')
	let token = req.query.token;
	
		const pool = await sql.connect(sqlString)
		try {
			const result = await sql.query`SELECT CODVEN, NOMVEN, CLAVE, CODDOC,EMPNIT FROM VENDEDORES WHERE TOKEN=${token}`
			console.dir('La consulta usuario se generó');
			res.send(result);
		
		} catch (err) {
			// ... error checks
			res.send('Denegado');
			console.log('Error en la consulta usuarios');
		}
		sql.close()
});

// INSERTA DATOS EN LA TABLA DOCUMENTOS DEL SERVER
//app.get("/ventas/documentos", async(req,res)=>{
router.post("/ventas/documentos", async(req,res)=>{

	const sql = require('mssql')

	let _empnit = req.body.empnit;
	let _coddoc = req.body.coddoc;
	let _correlativo = req.body.correlativo;
	let _codcliente = req.body.codcliente;
	let _totalventa = req.body.totalventa;
	let _totalcosto = req.body.totalcosto;
	let _token = req.body.token;
	let _anio =  req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	let _codven = req.body.codven;
	let _fecha = new Date(_anio,_mes,_dia);
	let _obs = req.body.obs;
	let _st = req.body.st;
	let _lat = req.body.lat || '0';
	let _long = req.body.long || '0';

		
	console.log('Llegó la solicitud ' + 'coddoc:' + _coddoc + ' correlativo: ' + _correlativo + ' cliente: ' + _codcliente + ' total: ' + _totalventa);

	let sqlQry = 'insert into web_documentos (empnit,token,coddoc,correlativo,anio,mes,dia,fecha,codven,codcliente,totalventa,totalcosto,obs,codst,entregado,lat,long) values (@empnit,@token,@coddoc,@correlativo,@anio,@mes,@dia,@fecha,@codven,@codcliente,@totalventa,@totalcosto,@obs,@codst,@entregado,@lat,@long)'

		//const pool = await sql.connect(sqlString)
		const pool1 = await new sql.ConnectionPool(config, err => {
			// ... error checks
					 
			// Query
			 pool1.request() // or: new sql.Request(pool1)
			 .input('empnit', sql.VarChar(50), _empnit)
			 .input('token', sql.VarChar(255), _token)
			 .input('coddoc', sql.VarChar(50), _coddoc)
			 .input('correlativo', sql.Float, _correlativo)
			 .input('anio', sql.Int, _anio)
			 .input('mes', sql.Int, _mes)
			 .input('dia', sql.Int, _dia)
			 .input('fecha', sql.Date, _fecha)
			 .input('codven', sql.Int, _codven)
			 .input('codcliente', sql.Int, _codcliente)
			 .input('totalventa', sql.Float, _totalventa)
			 .input('totalcosto', sql.Float, _totalcosto)
			 .input('obs', sql.VarChar(255), _obs)
			 .input('codst', sql.Int, _st)
			 .input('entregado', sql.VarChar(2), 'NO')
			 .input('lat', sql.VarChar(100), _lat)
			 .input('long', sql.VarChar(100), _long)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Ingreso exitoso')
				}
			});
			//sql.close()
			//pool1.release();
		})
		 
		pool1.on('error', err => {
			// ... error handler
		})
});

// INSERTA DATOS EN LA TABLA DOCPRODUCTOS DEL SERVER
router.post("/ventas/docproductos", async(req,res)=>{

	const sql = require('mssql')
	let _token = req.body.token;
	let _empnit = req.body.empnit;

	let _anio =  req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	
	let _coddoc = req.body.coddoc;
	let _correlativo = req.body.correlativo;
	let _codprod = req.body.codprod;
	let _desprod = req.body.desprod;
	let _codmedida = req.body.codmedida;
	let _equivale = req.body.equivale;
	let _cantidad = req.body.cantidad;
	let _costo = req.body.costo;
	let _precio = req.body.precio;
	let _totalcosto = req.body.totalcosto;
	let _totalprecio = req.body.totalprecio;
	
	console.log('peticion de insert en docprodutos: ' + _desprod)
	
		const pool2 = await new sql.ConnectionPool(config, err => {
			 var sqlQry = 'insert into web_docproductos (token,empnit,anio,mes,dia,coddoc,correlativo,codprod,desprod,codmedida,equivale,cantidad,costo,precio,totalcosto,totalprecio) values (@token,@empnit,@anio,@mes,@dia,@coddoc,@correlativo,@codprod,@desprod,@codmedida,@equivale,@cantidad,@costo,@precio,@totalcosto,@totalprecio)'
			 pool2.request() // or: new sql.Request(pool1)
			 .input('token', sql.VarChar(255), _token)
			 .input('empnit', sql.VarChar(50), _empnit)
			 .input('anio', sql.Int, _anio)
			 .input('mes', sql.Int, _mes)
			 .input('dia', sql.Int, _dia)
			 .input('coddoc', sql.VarChar(50), _coddoc)
			 .input('correlativo', sql.Float, _correlativo)
			 .input('codprod', sql.VarChar(100), _codprod)
			 .input('desprod', sql.VarChar(250), _desprod)
			 .input('codmedida', sql.VarChar(50), _codmedida)
			 .input('equivale', sql.Int, _equivale )
			 .input('cantidad', sql.Int, _cantidad)
			 .input('costo', sql.Float, _costo)
			 .input('precio', sql.Float, _precio)
			 .input('totalcosto', sql.Float, _totalcosto)
			 .input('totalprecio', sql.Float, _totalprecio)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Ingreso exitoso docproductos... ' + _desprod)
				}
			});
			//sql.close()
			//pool1.release();
		 
		})
		 
		pool2.on('error', err => {
			// ... error handler
		})
});


module.exports = router;