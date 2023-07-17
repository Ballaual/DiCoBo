const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hide')
		.setDescription('Hides the current voice channel from everyone.')
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
				ViewChannel: false,
			});

			const newChannelName = `Hidden | ${channel.name}`;

			await channel.setName(newChannelName);

			return interaction.reply('The channel is now invisible for everyone except admins.');
		}
		catch (error) {
			console.error('Failed to hide channel:', error);
			return interaction.reply('An error occurred while hiding the channel.');
		}
	},
};
