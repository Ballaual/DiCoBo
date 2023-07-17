const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('limit')
		.setDescription('Sets the user limit for the voice channel.')
		.setDMPermission(false)
		.addIntegerOption(option =>
			option.setName('limit')
				.setDescription('The user limit for the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permissions to manage this channel.');
		}

		const userLimit = interaction.options.getInteger('limit');

		if (userLimit === null || userLimit < 0) {
			return interaction.reply('Invalid user limit specified.');
		}

		try {
			await channel.setUserLimit(userLimit);

			const limit = userLimit === 0 ? 'unlimited' : userLimit.toString();

			return interaction.reply(`The user limit for the voice channel has been set to \`${limit}\`.`);
		}
		catch (error) {
			console.error('Failed to set user limit for the channel:', error);
			return interaction.reply('An error occurred while setting the user limit for the channel.');
		}
	},
};
