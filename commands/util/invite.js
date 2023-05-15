const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { invite } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Displays the invite link of the bot')
		.setDMPermission(false),
	category: 'util',
	async execute(interaction) {
		if (!invite) {
			return interaction.reply({ content: 'Missing `invite` parameter in config.json', ephemeral: true });
		}

		if (!invite.startsWith('https://discord.com/')) {
			return interaction.reply({ content: 'Please provide a valid invite link', ephemeral: true });
		}

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.client.user.username}'s invite link`)
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.setColor('#007BFF')
			.setDescription(`You can invite me to your server with the following link:\n${invite}`);

		return interaction.reply({ embeds: [embed] });
	},
};