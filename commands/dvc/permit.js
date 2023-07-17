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
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permission to manage this channel.');
		}

		const userToPermit = interaction.options.getUser('user');

		if (!userToPermit) {
			return interaction.reply('Invalid user specified.');
		}

		try {
			await channel.permissionOverwrites.create(userToPermit, {
				ViewChannel: true,
				Connect: true,
			});

			return interaction.reply(`${userToPermit.username} has been permitted to join the locked channel.`);
		}
		catch (error) {
			console.error('Failed to permit user to join the channel:', error);
			return interaction.reply('An error occurred while permitting the user to join the channel.');
		}
	},
};
