const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Renames the voice channel.')
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The new name for the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permissions to manage this channel.');
		}

		const newName = interaction.options.getString('name');

		if (!newName) {
			return interaction.reply('Invalid channel name specified.');
		}

		try {
			await channel.setName(newName);

			return interaction.reply(`The voice channel has been renamed to \`${newName}\`.`);
		}
		catch (error) {
			console.error('Failed to rename the voice channel:', error);
			return interaction.reply('An error occurred while renaming the voice channel.');
		}
	},
};
