const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Posts a button to accept the rules')
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('The message to display above the button')
				.setRequired(true),
		)
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role that should be assigned when accepting the rules')
				.setRequired(true),
		),
	async execute(interaction) {
		const message = interaction.options.getString('message');
		const roleOption = interaction.options.getRole('role');
		const roleId = roleOption ? roleOption.id : null;
		const guildId = interaction.guild.id;

		if (roleId) {
			const data = {
				guildId: guildId,
				message: message,
				roleId: roleId,
			};

			const reactionRolesFolderPath = './config/reactionrole/';
			const reactionRolesFilePath = path.join(reactionRolesFolderPath, `${guildId}-rules.json`);

			if (!fs.existsSync(reactionRolesFolderPath)) {
				fs.mkdirSync(reactionRolesFolderPath, { recursive: true });
			}

			fs.writeFile(reactionRolesFilePath, JSON.stringify(data), (err) => {
				if (err) {
					console.error(err);
					return interaction.reply({
						content: 'An error occurred while saving the role assignment.',
						ephemeral: true,
					});
				}
			});
		}

		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Secondary)
			.setLabel('\u2705 Accept the rules')
			.setCustomId('rules-button');

		const row = new ActionRowBuilder()
			.addComponents(button);

		await interaction.reply({
			content: message,
			components: [row],
		});
	},
};
