const CONTROLS = {
	PO7501: {
		labels: [
			'генератор постоянного тока номер 1',
			'ПО-750 1',
			'генератор постоянного тока 1'
		]
	},
	PO7502: {
		labels: [
			'генератор постоянного тока номер 2',
			'ПО-750 2',
			'генератор постоянного тока 2'
		]
	},
	BATTERY_HEATING: {
		labels: [
			'обогрев аккумулятора'
		]
	},
	DC_GEN: {
		labels: [
			'аккумулятор постоянного тока'
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
		labels: ['руд', 'малый газ']
	},
	ENGINE_START: {
		labels: ['двигатель'],
		useDeps: true,
		delay: 10000,
		deps: [
			'PO7501',
			'PO7502',
			'BATTERY_HEATING',
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
		}
	},
	GYRO_1: {
		labels: ['гиро 1']
	},
	GYRO_2: {
		labels: ['гиро 2']
	},
	AC_GEN: {
		labels: ['генератор переменного тока']
	},
	ARK: {
		labels: ['АРК', 'автоматический радиокомпас']
	},
	RAMRK: {
		labels: [
			'РВ МРП',
			'радиовысотомер и маркерный радиоприемник'
		]
	},
	RSBN: {
		labels: [
			'РСБН',
			'радиотехническую систему ближней навигации'
		]
	},
	ADI: {
		labels: [
			'KПП',
			'авиагоризонт KПП'
		]
	},
	HSI: {
		labels: [
			'КСИ'
		]
	},
	SAU: {
		labels: [
			'САУ',
			'систему автоматического управления'
		]
	},
	EMERGENCY_HYDRAULIC: {
		labels: [
			'вспомогательную насосную станцию'
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
		labels: ['СОД']
	},
	CANOPY: {
		labels: ['фонарь']
	}
};

module.exports = CONTROLS;
