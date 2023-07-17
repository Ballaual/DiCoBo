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
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permissions to manage this channel.');
		}

		const userToBlock = interaction.options.getUser('user');

		if (!userToBlock) {
			return interaction.reply('Invalid user specified.');
		}

		try {
			await channel.permissionOverwrites.edit(userToBlock, {
				Connect: false,
			});

			return interaction.reply(`${userToBlock.username} has been blocked from connecting to the voice channel.`);
		}
		catch (error) {
			console.error('Failed to block user from connecting to the channel:', error);
			return interaction.reply('An error occurred while blocking the user from connecting to the channel.');
		}
	},
};
