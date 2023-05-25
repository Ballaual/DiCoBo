const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { github } = require('../../config/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Displays the link to the public github repository of the bot')
		.setDMPermission(false),
	category: 'core',
	async execute(interaction) {
		if (!github) {
			return interaction.reply({ content: 'Missing `githubLink` parameter in config.json', ephemeral: true });
		}

		if (!github.startsWith('https://github.com/')) {
			return interaction.reply({ content: 'Please provide a valid Github link', ephemeral: true });
		}

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.client.user.username}'s Github repository`)
			.setThumbnail('https://cdn.discordapp.com/emojis/1091295909972803616.png')
			.setColor('#007BFF')
			.setDescription(`You can find the sourcecode here:\n${github}`);

		return interaction.reply({ embeds: [embed] });
	},
};