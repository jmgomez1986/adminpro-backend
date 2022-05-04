const getMenuFrontEnd = (role) => {
	const menu = [
		{
			titulo: 'Dashboard',
			icono: 'mdi mdi-gauge',
			submenu: [
				{
					titulo: 'Main',
					url: '/',
				},
				{
					titulo: 'ProgressBar',
					url: 'progress',
				},
				{
					titulo: 'Charts',
					url: 'charts',
				},
				{
					titulo: 'Promesas',
					url: 'promises',
				},
				{
					titulo: 'Observables RxJs',
					url: 'rxjs',
				},
			],
		},
		{
			titulo: 'Mantenimiento',
			icono: 'mdi mdi-folder-lock-open',
			submenu: [
				// {
				// 	titulo: 'Usuarios',
				// 	url: 'usuarios',
				// },
				{
					titulo: 'Medicos',
					url: 'medicos',
				},
				{
					titulo: 'Hospitales',
					url: 'hospitales',
				},
			],
		},
	];

	if (role === 'ADMIN_ROLE') {
		menu[1].submenu.unshift({
			titulo: 'Usuarios',
			url: 'usuarios',
		});
	}

  return menu;
};

module.exports = { getMenuFrontEnd };
