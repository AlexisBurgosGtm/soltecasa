const express = require('express');
const router = express.Router();
const execute = require('./connection');

// LOGIN
router.get("/login", async(req,res)=>{
	const {usuario,pass} = req.query;

	let qr = `SELECT [Codigo/Nit] AS CODCLIENTE,NOMBRE, USUARIO FROM CLIENTES WHERE USUARIO='${usuario}' AND PASS='${pass}'`
	execute.Query(res,qr);

});

module.exports = router;