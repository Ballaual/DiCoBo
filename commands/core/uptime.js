const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Displays the bots uptime')
		.setDMPermission(false),
	category: 'core',
	async execute(interaction) {
		const days = Math.floor(interaction.client.uptime / 86400000);
		const hours = Math.floor(interaction.client.uptime / 3600000) % 24;
		const minutes = Math.floor(interaction.client.uptime / 60000) % 60;
		const seconds = Math.floor(interaction.client.uptime / 1000) % 60;

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.client.user.username}`)
			.setColor('#00FF00')
			.addFields(
				{ name: ':computer: UPTIME', value: ` ${days} days ${hours} hrs ${minutes} min ${seconds} sec` })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};