const needle = require('needle');
const cheerio = require('cheerio');
const {askForMeme} = require('./askForMeme');

const AIRWAR_HOST = 'http://www.airwar.ru';
const ALPHABET_URL = `${AIRWAR_HOST}/main.html`;
const URL_DOM_SELECTOR = 'a[href$=".html"]';
const IS_ALPHABET_REGEX = /alfavit/;
const IS_RUS_REGEX = /rus/;
const HAS_TEXT_REGEX = /[A-Za-z0-9-А-я\-_]/;
const CUT_INDEX = -2;
const LTH_ANCHOR = 'a[name="LTH"]';

function getAirwarArticle(message) {
	const aircraft = message.content.match(/расскажи про\s(.*)/i)[1];

	if (!aircraft) {
		console.log('не сматчилось');
		return;
	}

	getArticleByMessage(aircraft, message);
}

function getArticleByMessage(message, m) {
	const firstLetter = message[0];

	return getUrlByLetter(firstLetter, message)
		.then(getArticlesByUrl)
		.then(getArticleUrlByBody)
		.then(getArticleByUrl)
		.then(({$, url}) => {
			const data = {url};
			const items = $('body > table');

			items.each(function (index) {
				const item = $(this);

				if (index === 0) {
					const dataNode = $(this).find('tr:last-child');
					data.title = dataNode.text().replace(/\s/gi, '');
					data.thumbnail = AIRWAR_HOST + dataNode.find('img').attr('src').replace(/\.\./g, '')
				}

				if (index === 1) {
					data.text = item
						.text().split('\n')
						.filter(item => item && HAS_TEXT_REGEX.test(item));
					data.text.splice(CUT_INDEX);

					data.image = AIRWAR_HOST + $(this).find('img').attr('src').replace(/\.\./g, '');
				}

				if (index === 3) {
					const dataNodesRaw = $(this).find(LTH_ANCHOR)
						.closest('div').find('table').eq(1).find('tr');

					const excludedSpecs = [
						'Экипаж',
					];
					const specData = [];

					dataNodesRaw.each(function (index) {
						if (index < 4) {
							return;
						}

						const node = $(this).text().split('\n')
							.filter(item => item && HAS_TEXT_REGEX.test(item))
							.map(item => item.replace(/^\s+/gi, ''))
							.filter(item => item).join('$');

						specData.push(node); 
					});

					let skip = false;
					data.specs = specData.reduce((result, item) => {
						skip = false;

						const items = item.split('$');

						if (!items || !items.length) {
							return;
						}

						const name = items.shift();
						let value;

						if (items.length) {
							value = items.join('\n');
						}

						excludedSpecs.forEach((exludedItem) => {
							const excludedRegEx = new RegExp(`${exludedItem}`, 'i');

							if (excludedRegEx.test(name)) {
								skip = true;
							}
						});

						if (!skip) {
							result.push({
								name,
								value: value || '>',
								inline: value ? value.length < 10 : true
							});
						}

						return result;
					}, []);

					m.reply(transformArticleToTemplate(data));
				}
			});
		})
		.catch(() => m.reply('Не нашел такой'));
}

function transformArticleToTemplate(data) {
	const {
		text,
		title,
		thumbnail,
		image,
		url,
		specs
	} = data;
	const description = [...text].slice(1);
	const company = description.shift();

	const message = {
		title: `${title} (${company})`,
		description: description.join('\n') + '\n\n',
		url,
		fields: specs,
		thumbnail: {
			url: thumbnail,
		},
		image: {
			url: image,
		},
		footer: {
			text: `Источник: Airwar`
		}
	};

	return {embed: message};
}

function getArticleByUrl(url) {
	return getCheerioBodyByUrl(`${AIRWAR_HOST}/${url}`);
}

function getArticleUrlByBody({result, message}) {
	const items = result(URL_DOM_SELECTOR);
	const match = new RegExp(`${message}(\\s|$)(?![(])`, 'i');

	let endArticleUrl;

	items.each(function () {
		const item = result(this);
		const text = item.text();
		const url = item.attr('href');

		if (match.test(text)) {
			endArticleUrl = url.replace(/\.\./g, '');
		}
	});

	return endArticleUrl;
}

function getArticlesByUrl({result, message}) {
	return getCheerioBodyByUrl(`${AIRWAR_HOST}/${result}`)
		.then(({$}) => ({result: $, message}));
}

function getUrlByLetter(letter, message) {
	return getAlphabetJSON()
		.then((alphabetJSON) => {
			return {
				result: alphabetJSON[letter.toUpperCase()],
				message
			};
		})
		.catch((error) => {
			console.log('getUrlByLetter error >', error);
		});
}

function getCheerioBodyByUrl(url) {
	return needle('get', url)
		.then(({body}) => ({$: cheerio.load(body), url}))
		.catch(error => error);
}

function getAlphabetJSON() {
	return getCheerioBodyByUrl(ALPHABET_URL)
		.then(({$}) => {
			const items = $(URL_DOM_SELECTOR);
			const alphabetJSON = {};

			items.each(function () {
				const item = $(this);
				const text = item.text();
				const url = item.attr('href');

				if (IS_ALPHABET_REGEX.test(url)) {
					if (IS_RUS_REGEX.test(url)) {
						alphabetJSON[text] = url;
					} else {
						alphabetJSON[text] = url;
					}
				}
			});

			return alphabetJSON;
		})
		.catch((error) => {
			console.log('getAlphabetJSON error >', error);
		});
}

module.exports = {
	airwarEntry: {
		aircraft: {
			pattern: /Начальник, расскажи про/i,
			reply: message => askForMeme(message, 'default', getAirwarArticle)
		}
	}
};
