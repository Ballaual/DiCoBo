const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log('\x1b[34m%s\x1b[0m', 'Logging into Bot User...');

		client.user.setPresence({
			activities: [
				{
					type: ActivityType.Listening,
					name: '/help',
				},
			],
			status: 'idle',
		});
		console.log('\x1b[34m%s\x1b[0m', `Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers!`);
	},
};