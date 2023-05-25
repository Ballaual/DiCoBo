const { Events, EmbedBuilder } = require('discord.js');
const { ownerId } = require('../config/config.json');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	execute(guild) {
		const owner = ownerId;

		const embed = new EmbedBuilder()
			.setColor('#00FF00')
			.setTitle('Bot hinzugefügt')
			.setDescription(`Der Bot wurde zum Server \`${guild.name}\` hinzugefügt.\n ID: ${guild.id}`);

		const admin = guild.client.users.cache.get(owner);
		if (admin) {
			admin.send({ embeds: [embed] }).catch(console.error);
		}
		else {
			console.error(`Admin mit der ID ${owner} nicht gefunden.`);
		}
	},
};
