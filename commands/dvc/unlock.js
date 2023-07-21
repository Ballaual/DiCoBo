const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlocks the current voice channel for everyone.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),

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

		const isChannelLocked = channel.permissionOverwrites.cache.some((overwrite) => {
			return overwrite.id === channel.guild.roles.everyone.id && overwrite.deny.has(PermissionsBitField.Flags.Connect);
		});

		if (!isChannelLocked) {
			return interaction.reply({ content: 'The channel is already unlocked.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				Connect: null,
			});

			await channel.permissionOverwrites.edit(interaction.user, {
				Connect: null,
			});

			const newChannelName = channel.name.replace(/^Locked \| /i, '');

			await channel.setName(newChannelName);

			if (channelInfo.isLocked) {
				channelInfo.isLocked = false;
				fs.writeFileSync(filePath, JSON.stringify(data));
			}

			const unlockedEmbed = new EmbedBuilder()
				.setTitle('Voice channel unlocked!')
				.setDescription('Your voice channel has been 🔓 unlocked for @everyone!')
				.setColor('#00FF00');

			return interaction.reply({ embeds: [unlockedEmbed], ephemeral: true });
		}
		catch (error) {
			console.error('Failed to unlock channel:', error);
			return interaction.reply({ content: 'An error occurred while unlocking the channel.', ephemeral: true });
		}
	},
};
