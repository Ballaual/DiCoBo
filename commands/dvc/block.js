const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Blocks a user from connecting to the voice channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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

		const userToBlock = interaction.options.getUser('user');

		if (!userToBlock) {
			return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.edit(userToBlock, {
				Connect: false,
			});

			return interaction.reply({ content: `\`${userToBlock.username}\` has been blocked from connecting to the voice channel.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to block user from connecting to the channel:', error);
			return interaction.reply({ content: 'An error occurred while blocking the user from connecting to the channel.', ephemeral: true });
		}
	},
};
