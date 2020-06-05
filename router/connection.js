const config = {user: 'onnebusi_admin',password: 'Razors1805$',server: '65.99.252.110',database: 'onnebusi_solteca',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'SOLTECADB', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

let execute = {
	Query : (res,sqlqry)=>{
		const sql = require('mssql')
		console.log('ejecutando consulta... ');
		
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			//pool1.request() or: new sql.Request(pool1)
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				//if(err) throw err;
				if(err){
					res.send(err.message)
				}else{
					res.send(result);
				}
					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},

	QueryNoSend : (res,sqlqry)=>{
		const sql = require('mssql')
		console.log('ejecutando consulta... ');
		
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			//pool1.request() or: new sql.Request(pool1)
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				//if(err) throw err;
				if(err){
					res.send(err.message)
				}else{
					res.send('Ejecución exitosa');
				}
					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},

}

module.exports = execute;

