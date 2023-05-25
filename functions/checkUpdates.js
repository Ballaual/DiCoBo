async function checkUpdates() {

	const mod = await import('node-fetch');
	const fetch = mod.default;
	const { version } = require('../version.json');

	console.log('\x1b[33m%s\x1b[0m', `Current version : ${version}`);

	fetch('https://raw.githubusercontent.com/ballaual/DiCoBo/master/version.json')
		.then((res) => res.json())
		.then((data) => {
			if (data.version !== version) {
				console.log('\x1b[32m%s\x1b[0m', '===============================Update Available===================================');
				console.log('Version:', data.version);
				console.log('\x1b[36m%s\x1b[0m', 'Check commit : https://github.com/ballaual/DiCoBo/commits/master');
				console.log('\x1b[31m%s\x1b[0m', 'Use `npm run update` to update');
				console.log('\x1b[32m%s\x1b[0m', '==================================================================================');
			}
			else {
				console.log('\x1b[32m%s\x1b[0m', 'No Update Available');
			}
		})
		.catch((err) => {
			console.log('\x1b[31m%s\x1b[0m', err);
		});
}

module.exports = checkUpdates;