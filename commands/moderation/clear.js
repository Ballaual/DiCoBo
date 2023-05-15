const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clear up to 99 messages.")
		.addIntegerOption(option =>
			option.setName("amount")
				.setDescription("Number of messages to clear")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100))
				.setDMPermission(false)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	category: "moderation",
	async execute(interaction) {
		const amount = interaction.options.getInteger("amount");

		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: "There was an error trying to clear messages in this channel!", ephemeral: true });
		});

		return interaction.reply({ content: `Successfully cleared \`${amount}\` messages.`, ephemeral: true });
	},
};