const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permit')
		.setDescription('Allows a user to join the locked channel.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to allow access to the locked channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({ content: 'You do not have permissions to manage this channel.', ephemeral: true });
		}

		const userToPermit = interaction.options.getUser('user');

		if (!userToPermit) {
			return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.create(userToPermit, {
				CONNECT: true,
			});

			return interaction.reply({ content: `${userToPermit.username} has been permitted to join the locked channel.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to permit user to join the channel:', error);
			return interaction.reply({ content: 'An error occurred while permitting the user to join the channel.', ephemeral: true });
		}
	},
};
