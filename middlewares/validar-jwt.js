const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {
	// Leer Token del header
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: 'No hay token en la peticion',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.JWT_SECRET);

		req.uid = uid;

		next();
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'El Token no es válido',
		});
	}
};

const validarAdminRole = async (req, res, next) => {
	const uid = req.uid;
	try {
		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'El usuario no existe',
			});
		}

		if (usuarioDB.role !== 'ADMIN_ROLE') {
			return res.status(403).json({
				ok: false,
				msg: 'No posee privilegios suficientes para realizar esta acción. Contacte al administrador',
			});
		}

    next();
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error interno',
		});
	}
};

const validarAdminRole_o_mismoUsuario = async (req, res, next) => {
	const uid = req.uid;
  const id = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'El usuario no existe',
			});
		}

		if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
			return res.status(403).json({
				ok: false,
				msg: 'No posee privilegios suficientes para realizar esta acción. Contacte al administrador',
			});
		}

	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Error interno',
		});
	}
};

module.exports = { validarJWT, validarAdminRole, validarAdminRole_o_mismoUsuario };
