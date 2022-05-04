const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {
	const busqueda = req.params.busqueda;
	const regexp = new RegExp(busqueda, 'i');

	const [usuarios, medicos, hospitales] = await Promise.all([
		Usuario.find({ nombre: regexp }),
		Medico.find({ nombre: regexp }),
		Hospital.find({ nombre: regexp }),
	]);

	res.json({
		ok: true,
		usuarios,
		medicos,
		hospitales,
	});
};

const getDocumentosColeccion = async (req, res = response) => {
	const tabla = req.params.tabla;
	const busqueda = req.params.busqueda;
	const regexp = new RegExp(busqueda, 'i');

	// Opcion con tabla y modelos del curso
	let data = [];

	switch (tabla) {
		case 'medicos':
			data = await Medico.find({ nombre: regexp })
				.populate('usuario', 'nombre img')
				.populate('hospital', 'nombre img');
			break;

		case 'hospitales':
			data = await Hospital.find({ nombre: regexp }).populate(
				'usuario',
				'nombre email img'
			);
			break;

		case 'usuarios':
			data = await Usuario.find({ nombre: regexp });
			break;

		default:
			return res.status(500).json({
				ok: false,
				msg: 'La tabla tiene que ser usuarios - medicos - hospitales',
			});
	}

	res.json({
		ok: true,
		resultados: data,
	});
};

const getDocumentosColeccionPag = async (req, res = response) => {
	const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 0;
	const tabla = req.params.tabla;
	const patron = req.params.busqueda;
	const regex = new RegExp(patron, 'i');
	let data;
	let total;

	switch (tabla) {
		case 'medicos':
			data = await Medico.find({ nombre: regex })
				.populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')
				.skip(desde)
				.limit(limite);
			total = await Medico.countDocuments({ nombre: regex });

			break;

		case 'hospitales':
			data = await Hospital.find({ nombre: regex })
				.populate('usuario', 'nombre img')
				.skip(desde)
				.limit(limite);
			total = await Hospital.countDocuments({ nombre: regex });
			break;

		case 'usuarios':
			data = await Usuario.find({ nombre: regex })
        .skip(desde)
        .limit(limite);
			total = await Usuario.countDocuments({ nombre: regex });
			break;

		default:
			return res.status(400).json({
				ok: false,
				msg: 'La tabla tiene que ser usuarios | medicos | hospitales',
			});
	}

	res.json({
		ok: true,
		resultados: data,
		total,
	});
};

module.exports = {
	getTodo,
	getDocumentosColeccion,
  getDocumentosColeccionPag
};
