const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const userDB = await Usuario.findOne({ email });

		// Verificar email
		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Email invalido',
			});
		}

		// Verificar contraseña
		const validPassword = bcrypt.compareSync(password, userDB.password);

		if (!validPassword) {
			return res.status(404).json({
				ok: false,
				msg: 'Contraseña invalida',
			});
		}

		// Generar el Token (JWT)
		const token = await generarJWT(userDB.id);

		res.json({
			ok: true,
			msg: 'Logueado exitosamente',
			token,
      menu: getMenuFrontEnd(userDB.role)
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const googleSignIn = async (req, res = reponse) => {
	const googleToken = req.body.token;

	try {
		const { name, email, picture } = await googleVerify(googleToken);

		// Verificar si el usuario existe
		const usuarioDB = await Usuario.findOne({ email });
		let usuario;

		if (!usuarioDB) {
			usuario = new Usuario({
				nombre: name,
				email,
				password: 'temporal',
				img: picture,
				google: true,
			});
		} else {
			usuario = usuarioDB;
			usuario.google = true;

      // Si el usuario no tiene imagen, le asignamos la de google
      if(!usuario.img) {
        usuario.img = picture;
      }
		}

		// Guardar en DB
		await usuario.save();

		// Generar el Token (JWT)
		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			msg: 'Google Sign-in',
			token,
      menu: getMenuFrontEnd(usuario.role)
		});
	} catch (error) {
		res.status(401).json({
			ok: false,
			msg: 'El token no es correcto',
		});
	}
};

const renewToken = async (req, res) => {
	const uid = req.uid;
	// Generar el Token (JWT)
	const token = await generarJWT(uid);
  // Obtener usuario
  const userDB = await Usuario.findById(uid);

	res.json({
		ok: true,
		msg: 'Google Sign-in',
		token,
    usuario: userDB,
    menu: getMenuFrontEnd(userDB.role)
	});
};

module.exports = {
	login,
	googleSignIn,
	renewToken,
};
