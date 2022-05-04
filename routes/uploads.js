/*
  Ruta: api/uploads/:busqueda
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpLoad, returnImage } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpLoad);
router.get('/:tipo/:img', returnImage);

module.exports = router;
