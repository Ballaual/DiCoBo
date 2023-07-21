const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks the current voice channel for everyone.')
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

		let isChannelLocked = false;
		channel.permissionOverwrites.cache.forEach((overwrite) => {
			if (overwrite.id === channel.guild.roles.everyone.id && overwrite.deny.has(PermissionsBitField.Flags.Connect)) {
				isChannelLocked = true;
			}
		});

		if (isChannelLocked) {
			return interaction.reply({ content: 'The channel is already locked.', ephemeral: true });
		}

		try {
			await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
				Connect: false,
			});

			await channel.permissionOverwrites.edit(interaction.user, {
				Connect: true,
			});

			const newChannelName = `Locked | ${channel.name}`;

			await channel.setName(newChannelName);

			if (!channelInfo.isLocked) {
				channelInfo.isLocked = true;
				fs.writeFileSync(filePath, JSON.stringify(data));
			}

			const lockedEmbed = new EmbedBuilder()
				.setTitle('Voice channel locked!')
				.setDescription('Your voice channel has been 🔒 locked for @everyone!')
				.setColor('#00FF00');

			return interaction.reply({ embeds: [lockedEmbed], ephemeral: true });
		}
		catch (error) {
			console.error('Failed to lock channel:', error);
			return interaction.reply({ content: 'An error occurred while locking the channel.', ephemeral: true });
		}
	},
};
