const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const fileUpLoad = async (req, res = response) => {
	const tipo = req.params.tipo;
	const id = req.params.id;
	const tiposValidos = ['usuarios', 'hospitales', 'medicos'];

	if (!tiposValidos.includes(tipo)) {
		return res.status(400).json({
			ok: false,
			msg: 'El tipo tiene que ser: usuarios - medicos - hospitales',
		});
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({
			ok: false,
			msg: 'No hay ningun archivo',
		});
	}

	// Procesar la imagen ...
	const file = req.files.imagen;
	const nombreCortado = file.name.split('.');
	const extensionArchivo = nombreCortado[nombreCortado.length - 1];

	// Validar extension
	const extensionesValidas = ['png', 'jpg', 'gif'];

	if (!extensionesValidas.includes(extensionArchivo)) {
		return res.status(400).json({
			ok: false,
			msg: 'La extension del archivo no está permitida (*.png, *.jpg, *.gif)',
		});
	}

	// Generar el nombre del archivo
	const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

	// Path para guardar la imagen
	const path = `./uploads/${tipo}/${nombreArchivo}`;

	// Mover la imagen
	file.mv(path, function (err) {
		if (err) {
			console.log(err);
			return res.status(400).json({
				ok: false,
				msg: 'La extension del archivo no está permitida (*.png, *.jpg, *.gif)',
			});
		}

		// Actualizar la base de datos
		actualizarImagen(tipo, id, nombreArchivo);

		res.json({
			ok: true,
			msg: 'Archivo subido',
			nombreArchivo,
		});
	});
};

const returnImage = async (req, res = response) => {
	const tipo = req.params.tipo;
	const image = req.params.img;
	const tiposValidos = ['usuarios', 'hospitales', 'medicos'];
	let pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

	if (!tiposValidos.includes(tipo)) {
		return res.status(400).json({
			ok: false,
			msg: 'El tipo tiene que ser: usuarios - medicos - hospitales',
		});
	}

  // Imagen por defecto
  if (!fs.existsSync(pathImg)) {
    pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
  }
  res.sendFile(pathImg);


};

module.exports = {
	fileUpLoad,
	returnImage,
};
