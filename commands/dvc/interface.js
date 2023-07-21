const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { vcInterface } = require('../../util/vcInterface');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('interface')
		.setDescription('Creates the interface for managing dynamic voice channels')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {

		await interaction.reply({ content: 'The interface has been created and will be sent shortly!', ephemeral: true });
		await vcInterface(interaction.channel);
	},
};
