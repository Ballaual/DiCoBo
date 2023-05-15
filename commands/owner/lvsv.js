const { SlashCommandBuilder } = require('@discordjs/builders');
const { authorId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lvsv')
		.setDescription('Leaves a specified discord server | Bot owner only!')
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('id')
				.setDescription('id server')
				.setRequired(true)),
	category: 'owner',
	async execute(interaction) {
		const guildId = interaction.options.getString('id');
		const guild = interaction.client.guilds.cache.get(guildId);

		if (interaction.member.id !== authorId) {
			return interaction.reply({ content: 'Only the bot owner is allowed to use this command!', ephemeral: true });
		}

		if (!guild) {
			return interaction.reply({ content: 'No guild ID was specified. Please specify a guild ID', ephemeral: true });
		}

		try {
			await guild.leave();
			return interaction.reply({ content: `Left **${guild.name}** with \`${guild.memberCount}\` members.`, ephemeral: true });
		}
		catch (err) {
			return interaction.reply({ content: `An error occurred while leaving the server: \`${err.message}\``, ephemeral: true });
		}
	},
};
