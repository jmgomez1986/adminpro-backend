/*
  Ruta: api/todo/:busqueda
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
	getTodo,
	getDocumentosColeccion,
	getDocumentosColeccionPag,
} = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);
// router.get(
// 	'/coleccion/:tabla/:busqueda',
// 	validarJWT,
// 	getDocumentosColeccionPag
// );

module.exports = router;
