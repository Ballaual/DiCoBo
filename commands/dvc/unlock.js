const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlocks the current voice channel for everyone.')
		.setDMPermission(false),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permissions to manage this channel.');
		}

		try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				Connect: false,
			});

			await channel.permissionOverwrites.edit(interaction.user, {
				Connect: null,
			});

			const newChannelName = channel.name.replace(/^Locked \| /i, '');

			await channel.setName(newChannelName);

			return interaction.reply('The channel is now unlocked for everyone.');
		}
		catch (error) {
			console.error('Failed to unlock channel:', error);
			return interaction.reply('An error occurred while unlocking the channel.');
		}
	},
};
