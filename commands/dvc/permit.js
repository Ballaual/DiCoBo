const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

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

		const guildId = interaction.guild.id;
		const filePath = getGuildFilePath(guildId);

		if (!fs.existsSync(filePath)) {
			return interaction.reply({ content: 'The configuration file does not exist.', ephemeral: true });
		}

		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const userChannels = data.userChannels || {};

		const channelInfo = userChannels[channel.id];
		if (!channelInfo) {
			return interaction.reply({ content: 'This channel is not managed by the bot.', ephemeral: true });
		}

		const channelOwnerId = channelInfo.channelOwnerId;
		const isUserAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

		if (channelOwnerId !== interaction.user.id && !isUserAdmin) {
			return interaction.reply({ content: 'Only the channel owner and Administrators can use this command!', ephemeral: true });
		}

		const userToPermit = interaction.options.getUser('user');

		if (!userToPermit) {
			return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.create(userToPermit, {
				Connect: true,
				ViewChannel: true,
			});

			return interaction.reply({ content: `${userToPermit.username} has been permitted to join the locked channel.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to permit user to join the channel:', error);
			return interaction.reply({ content: 'An error occurred while permitting the user to join the channel.', ephemeral: true });
		}
	},
};
