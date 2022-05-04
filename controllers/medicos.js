const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
	const medicos = await Medico.find()
		.populate('usuario', 'nombre img')
		.populate('hospital', 'nombre img');

	res.json({
		ok: true,
		medicos,
		uid: req.uid,
	});
};

const crearMedico = async (req, res = response) => {
	const uid = req.uid;
	const medico = new Medico({ usuario: uid, ...req.body });

	console.log(uid);

	try {
		const medicoDB = await medico.save();

		res.json({
			ok: true,
			medico: medicoDB,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const actualizarMedico = async (req, res = response) => {
	const medicoId = req.params.id;
	const usuarioId = req.uid;

	try {
		const medicoDB = await Medico.findById(medicoId);

		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Medico no encontrado por ese id',
			});
		}

		const cambiosMedico = { ...req.body, usuario: usuarioId };

		const medicoActualizado = await Medico.findByIdAndUpdate(
			medicoId,
			cambiosMedico,
			{
				new: true,
			}
		);

		res.json({
			ok: true,
			msg: 'Medico actualizado',
			medico: medicoActualizado,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const borrarMedico = async (req, res = response) => {
	const medicoId = req.params.id;

	try {
		const medicoDB = await Medico.findById(medicoId);

		if (!medicoDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Medico no encontrado por ese id',
			});
		}

		await Medico.findByIdAndDelete(medicoId);

		res.json({
			ok: true,
			msg: 'Medico eliminado',
		});
	} catch (error) {
    console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado....',
		});
	}
};

const getMedicoById = async (req, res = response) => {
	const id = req.params.id;

	try {
		const medicos = await Medico.findById(id)
			.populate('usuario', 'nombre img')
			.populate('hospital', 'nombre img');

		res.json({
			ok: true,
			medicos,
			uid: req.uid,
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
	getMedicos,
	crearMedico,
	actualizarMedico,
	borrarMedico,
	getMedicoById,
};
