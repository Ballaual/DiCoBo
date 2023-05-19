const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them from the server.')
		.addUserOption(option => option
			.setName('target')
			.setDescription('The member to kick')
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('The reason for the kick')
			.setRequired(false)),
	category: 'moderation',
	async execute(interaction) {
		const user = interaction.options.getMember('target');
		const reason = interaction.options.getString('reason') || 'No reason specified';

		// Check if the member being kicked is the server owner or an admin
		if (user.id === interaction.guild.ownerId) {
			return interaction.reply({ content: 'You cannot kick the server owner!', ephemeral: true });
		}

		// Perform the kick
		await user.kick({ reason });
		return interaction.reply({ content: `Successfully kicked \`${user.user.tag}\` for: \`${reason}\`` });
	},
};
