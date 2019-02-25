const CONTROLS = {
	PO7501: {
		labels: [
			'преобразователь тока номер 1',
			'ПО-750 1',
			'преобразователь постоянного тока номер 1',
			'преобразователь тока 1',
			'преобразователь 1'
		]
	},
	PO7502: {
		labels: [
			'преобразователь тока номер 2',
			'ПО-750 2',
			'преобразователь постоянного тока номер 2',
			'преобразователь тока 2',
			'преобразователь 2'
		]
	},
	BATTERY_HEATING: {
		labels: [
			'обогрев аккума',
			'обогрев аккумулятора'
		]
	},
	DC_ACC: {
		labels: [
			'аккумулятор',
			'аккумулятор постоянного тока'
		]
	},
	DC_GEN: {
		labels: [
			'генератор',
			'генератор постоянного тока'
		]
	},
	FIRE_EXTINGUISHER: {
		labels: [
			'пожарное оборудование',
			'огнетушитель'
		]
	},
	FUEL_PUMP1: {
		labels: [
			'насос первой группы баков',
			'насос 1 группы баков',
			'насос первой группы'
		]
	},
	FUEL_PUMP3: {
		labels: [
			'насос третьей группы баков',
			'насос 3 группы баков',
			'насос третьей группы'
		]
	},
	FUEL_PUMP_DRAIN: {
		labels: [
			'расход насос',
			'расходный насос',
			'расход. насос'
		]
	},
	APU: {
		labels: [
			'агрегат запуска',
			'ВСУ',
			'внутреннюю силовую установку'
		]
	},
	THROTTLE_IDLE: {
		labels: ['РУД', 'малый газ']
	},
	ENGINE_START: {
		labels: ['двигатель'],
		useDeps: true,
		delay: 10000,
		deps: [
			'PO7501',
			'PO7502',
			'BATTERY_HEATING',
			'DC_ACC',
			'DC_GEN',
			'FIRE_EXTINGUISHER',
			'FUEL_PUMP1',
			'FUEL_PUMP3',
			'FUEL_PUMP_DRAIN',
			'APU',
			'THROTTLE_IDLE'
		],
		onSuccess: {
			image: 'https://i.imgur.com/PL1sj1B.png'
		},
		penalty: 0.25
	},
	GYRO_1: {
		labels: ['гиро 1'],
		useDeps: true,
		deps: ['ENGINE_START']
	},
	GYRO_2: {
		labels: ['гиро 2'],
		useDeps: true,
		deps: ['ENGINE_START']
	},
	AC_GEN: {
		labels: ['генератор переменного тока']
	},
	ARK: {
		labels: ['АРК', 'автоматический радиокомпас'],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2'],
		penalty: 0.95
	},
	RAMRK: {
		labels: [
			'РВ МРП',
			'радиовысотомер и маркерный радиоприемник',
			'радиовысотомер',
			'маркерный радиоприемник'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2'],
		penalty: 0.8
	},
	RSBN: {
		labels: [
			'радиотехническую систему ближней навигации',
			'РСБН'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2'],
		penalty: 0.95
	},
	ADI: {
		labels: [
			'КПП',
			'авиагоризонт КПП',
			'авиагоризонт'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2'],
		penalty: 0.8
	},
	HSI: {
		labels: [
			'КСИ'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2'],
		penalty: 0.8
	},
	SAU: {
		labels: [
			'систему автоматического управления',
			'САУ'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2']
	},
	EMERGENCY_HYDRAULIC: {
		labels: [
			'вспомогательную насосную станцию',
			'вспомогательная насосная станция'
		]
	},
	NOSECONE: {
		labels: [
			'конус'
		]
	},
	SPO: {
		labels: ['СПО']
	},
	SOD: {
		labels: ['транспондер', 'СОД', 'передатчик свой-чужой']
	},
	CANOPY: {
		labels: ['фонарь']
	},
	MISSILE_CONTROLLER: {
		labels: ['СС РНС ФКП']
	},
	PYLONS_1: {
		labels: [
			'питание на пилоны 1-2',
			'пилоны 1-2'
		]
	},
	PYLONS_2: {
		labels: [
			'питание на пилоны 3-4',
			'пилоны 3-4'
		]
	},
	GUNSIGHT: {
		labels: [
			'прицел',
			'АСП-ПФД',
			'АСП-ПФД-21'
		],
		useDeps: true,
		deps: ['GYRO_1', 'GYRO_2']
	},
	IFF: {
		labels: [
			'ифф',
			'СРЗО'
		]
	}
};

module.exports = CONTROLS;
