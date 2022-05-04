const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
	const desde = Number(req.query.desde) || 0;
	const limite = Number(req.query.limite) || 0;
	// let usuarios;
	// let totalReg;

	// Opcion 1
	// const usuarios = await Usuario
	//   .find({}, 'nombre email role google')
	//   .skip(desde)
	//   .limit(limite);
	// const totalReg = await Usuario.count();

	// Opcion 2
	// await Promise.all([
	// 	Usuario
	//     .find({}, 'nombre email role google')
	//     .skip(desde)
	//     .limit(limite),

	// 	Usuario.count(),
	// ]).then((response) => {
	//   usuarios = response[0];
	//   totalReg = response[1];
	// });

	// Opcion 3
	const [usuarios, totalReg] = await Promise.all([
		Usuario.find({}, 'nombre email role google img').skip(desde).limit(limite),
		Usuario.countDocuments(),
	]);

	res.json({
		ok: true,
		usuarios,
		totalReg,
		uid: req.uid,
	});
};

const crearUsuario = async (req, res = response) => {
	const { password, email } = req.body;

	try {
		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya está registrado',
			});
		}

		const usuario = new Usuario(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();

		usuario.password = bcrypt.hashSync(password, salt);

		// Guardar usuario
		await usuario.save();

		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const actualizarUsuario = async (req, res = response) => {
	const uid = req.params.id;

	try {
		// TODO: validar token y comprobar si es el usuario correcto

		const userDB = await Usuario.findById(uid);

		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario con el id ingresado',
			});
		}

		// Actualizaciones
		const { password, google, email, ...campos } = req.body;

		if (userDB.email !== email) {
			const existeEmail = await Usuario.findOne({ email });

			if (existeEmail) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un usuario con ese email',
				});
			}
		}

    if (!userDB.google) {
      campos.email = email;
    } else if (userDB.email != email) {
      return res.status(400).json({
        ok: false,
        msg: 'Los usuarios de Gogle no pueden cambiar su correo',
      });
    }

		const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
			new: true,
		});

		res.json({
			ok: true,
			usuarioActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const borrarUsuario = async (req, res = response) => {
	const uid = req.params.id;

	try {
		const existeUserDB = await Usuario.findById(uid);

		if (!existeUserDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario con el id ingresado',
			});
		}

		await Usuario.findByIdAndDelete(uid);

		res.json({
			ok: true,
			msg: 'Usuario eliminado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

module.exports = {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	borrarUsuario,
};
