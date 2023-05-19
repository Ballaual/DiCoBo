const { Events, EmbedBuilder } = require('discord.js');
const { ownerId } = require('../config.json');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	execute(guild) {
		const adminID = ownerId;

		const embed = new EmbedBuilder()
			.setColor('#FF0000')
			.setTitle('Bot entfernt')
			.setDescription(`Der Bot wurde vom Server \`${guild.name}\` entfernt.\n ID: ${guild.id}`);

		const admin = guild.client.users.cache.get(adminID);
		if (admin) {
			admin.send({ embeds: [embed] }).catch(console.error);
		}
		else {
			console.error(`Admin mit der ID ${adminID} nicht gefunden.`);
		}
	},
};
