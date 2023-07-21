const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Blocks a user from connecting to the voice channel.')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to block from connecting to the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({ content: 'You do not have permissions to manage this channel.', ephemeral: true });
		}

		const userToBlock = interaction.options.getUser('user');

		if (!userToBlock) {
			return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.edit(userToBlock, {
				CONNECT: false,
			});

			return interaction.reply({ content: `${userToBlock.username} has been blocked from connecting to the voice channel.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to block user from connecting to the channel:', error);
			return interaction.reply({ content: 'An error occurred while blocking the user from connecting to the channel.', ephemeral: true });
		}
	},
};
