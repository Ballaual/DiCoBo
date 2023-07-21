const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Kicks a user from the voice channel.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to kick from the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({ content: 'You do not have permissions to kick members.', ephemeral: true });
		}

		const userToKick = interaction.options.getUser('user');

		if (!userToKick) {
			return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
		}

		const memberToKick = channel.members.get(userToKick.id);

		if (!memberToKick) {
			return interaction.reply({ content: `${userToKick.username} is not in the same voice channel.`, ephemeral: true });
		}

		try {
			await memberToKick.voice.setChannel(null);

			return interaction.reply({ content: `${userToKick.username} has been kicked from the voice channel.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to kick user from the channel:', error);
			return interaction.reply({ content: 'An error occurred while kicking the user from the channel.', ephemeral: true });
		}
	},
};
