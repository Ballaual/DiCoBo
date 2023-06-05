const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('Change the nickname of a user')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addUserOption(option => option
			.setName('target')
			.setDescription('The user to change the nickname for')
			.setRequired(true))
		.addStringOption(option => option
			.setName('nickname')
			.setDescription('The new nickname for the user')
			.setRequired(true)),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const nickname = interaction.options.getString('nickname');

		await member.setNickname(nickname);

		return interaction.reply({ content: `Successfully changed the nickname for \`${member.user.tag}\` to \`${nickname}\`.`, ephemeral: true });
	},
};
