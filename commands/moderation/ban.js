const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them from the server.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption(option => option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('The reason for the ban')
			.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getMember('target');
		const reason = interaction.options.getString('reason') || 'No reason specified';

		if (user.id === interaction.guild.ownerId) {
			return interaction.reply({ content: 'You cannot bam the server owner!', ephemeral: true });
		}

		await user.ban({ reason });
		return interaction.reply({ content: `Successfully banned \`${user.user.username}\` for: \`${reason}\`` });
	},
};
