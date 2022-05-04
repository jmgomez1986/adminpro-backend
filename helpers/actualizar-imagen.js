const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (tipo, modelo) => {
  const pathViejo = `./uploads/${tipo}/${modelo.img}`;
  if (fs.existsSync(pathViejo)) {
    // Borrar la imagen anterior
    fs.unlinkSync(pathViejo);
  }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
	switch (tipo) {
		case 'medicos':
			const medico = await Medico.findById(id);
			if (!medico) {
				return false;
			}

      borrarImagen(tipo, medico);

			medico.img = nombreArchivo;
			await medico.save();
      return true;

		case 'hospitales':
      const hospital = await Hospital.findById(id);
			if (!hospital) {
				return false;
			}

      borrarImagen(tipo, hospital);

			hospital.img = nombreArchivo;
			await hospital.save();
      return true;
		case 'usuarios':
			const usuario = await Usuario.findById(id);
			if (!usuario) {
				return false;
			}

      borrarImagen(tipo, usuario);

			usuario.img = nombreArchivo;
			await usuario.save();
      return true;
		default:
			return res.status(500).json({
				ok: false,
				msg: 'La tabla tiene que ser usuarios - medicos - hospitales',
			});
	}
};

module.exports = {
	actualizarImagen,
};
