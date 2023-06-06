const { Events } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {

		if (message.attachments.first() !== undefined && message.content !== '') {
			console.log('\x1b[32m%s\x1b[0m', `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`);
			console.log('\x1b[32m%s\x1b[0m', `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`);
		}
		else if (message.attachments.first() !== undefined && message.content === '') {
			console.log('\x1b[32m%s\x1b[0m', `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`);
		}
		else if (message.attachments.first() === undefined && message.content !== '') {
			console.log('\x1b[32m%s\x1b[0m', `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`);
		}
		else if (message.embeds.length !== 0) {
			const a = message.embeds[0];
			const embed = {};
			for (const b in a) {
				if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
					embed[b] = a[b];
				}
			}
			console.log('\x1b[32m%s\x1b[0m', `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} (${message.author.id}) sent an embed in ${message.channel.id}: ${JSON.stringify(embed, null, 2)}`);
		}
	},
};