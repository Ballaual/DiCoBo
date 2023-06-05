const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('Displays the command log')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		try {
			const serverId = interaction.guild.id;
			const logFilePath = path.join(__dirname, '../../logs', `${serverId}.txt`);

			if (!fs.existsSync(logFilePath)) {
				await interaction.reply({ content: 'There is no command log for this server.', ephemeral: true });
				return;
			}

			const attachment = new AttachmentBuilder(logFilePath, `${serverId}.txt`);
			await interaction.reply({
				content: 'Here is the command log:',
				files: [attachment],
				ephemeral: true,
			});
		}
		catch (err) {
			console.error(err);
			await interaction.reply(
				'There was an error while fetching the command log.',
			);
		}
	},
};
