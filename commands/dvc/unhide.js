const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unhide')
		.setDescription('Unhides the current voice channel for everyone.')
		.setDMPermission(false),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permission to manage this channel.');
		}

		try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				ViewChannel: null,
			});

			const newChannelName = channel.name.replace(/^Hidden \| /i, '');

			await channel.setName(newChannelName);

			return interaction.reply('The channel is now visible for everyone.');
		}
		catch (error) {
			console.error('Failed to unhide channel:', error);
			return interaction.reply('An error occurred while unhiding the channel.');
		}
	},
};
