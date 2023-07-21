const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vc')
		.setDescription('Manage dynamic voice channels')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lock')
				.setDescription('Locks the current voice channel for everyone.')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('unlock')
				.setDescription('Unlocks the current voice channel for everyone.')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('rename')
				.setDescription('Renames the voice channel.')
				.addStringOption(option =>
					option.setName('name')
						.setDescription('The new name for the voice channel.')
						.setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('limit')
				.setDescription('Sets the user limit for the voice channel.')
				.addIntegerOption(option =>
					option.setName('limit')
						.setDescription('The user limit for the voice channel.')
						.setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('permit')
				.setDescription('Allows a user to join the locked channel.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to allow access to the locked channel.')
						.setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('kick')
				.setDescription('Kicks a user from the voice channel.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to kick from the voice channel.')
						.setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('ban')
				.setDescription('Prevents a user from connecting to the voice channel.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to block from connecting to the voice channel.')
						.setRequired(true))
		),

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'lock') {
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

				const newChannelName = `Locked | ${channel.name}`;

				await channel.setName(newChannelName);

				if (!channelInfo.isLocked) {
					channelInfo.isLocked = true;
					fs.writeFileSync(filePath, JSON.stringify(data));
				}

				return interaction.reply({ content: 'The channel has been locked for everyone.', ephemeral: true });
			}
			catch (error) {
				console.error('Failed to lock channel:', error);
				return interaction.reply({ content: 'An error occurred while locking the channel.', ephemeral: true });
			}
		} else if (subcommand === 'unlock') {
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

				const newChannelName = channel.name.replace(/^Locked \| /i, '');

				await channel.setName(newChannelName);

				if (channelInfo.isLocked) {
					channelInfo.isLocked = false;
					fs.writeFileSync(filePath, JSON.stringify(data));
				}

				return interaction.reply({ content: 'The channel is now unlocked for everyone.', ephemeral: true });
			}
			catch (error) {
				console.error('Failed to unlock channel:', error);
				return interaction.reply({ content: 'An error occurred while unlocking the channel.', ephemeral: true });
			}
		} else if (subcommand === 'rename') {
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

			const newName = interaction.options.getString('name');

			if (!newName) {
				return interaction.reply({ content: 'Invalid channel name specified.', ephemeral: true });
			}

			try {
				await channel.setName(newName);

				if (userChannels[channel.id]) {
					userChannels[channel.id].channelName = newName;
				}

				fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));

				return interaction.reply({ content: `The voice channel has been renamed to \`${newName}\`.`, ephemeral: true });
			}
			catch (error) {
				console.error('Failed to rename the voice channel:', error);
				return interaction.reply({ content: 'An error occurred while renaming the voice channel.', ephemeral: true });
			}
		} else if (subcommand === 'limit') {
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

			const userLimit = interaction.options.getInteger('limit');

			if (userLimit === null || userLimit < 0) {
				return interaction.reply({ content: 'Invalid user limit specified.', ephemeral: true });
			}

			try {
				await channel.setUserLimit(userLimit);

				const limit = userLimit === 0 ? 'unlimited' : userLimit.toString();

				if (userChannels[channel.id]) {
					userChannels[channel.id].userLimit = userLimit;
					fs.writeFileSync(filePath, JSON.stringify(data));
				}

				return interaction.reply({ content: `The user limit for the voice channel has been set to \`${limit}\`.`, ephemeral: true });
			}
			catch (error) {
				console.error('Failed to set user limit for the channel:', error);
				return interaction.reply({ content: 'An error occurred while setting the user limit for the channel.', ephemeral: true });
			}
		} else if (subcommand === 'permit') {
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
		} else if (subcommand === 'kick') {
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

			const userToKick = interaction.options.getUser('user');

			if (!userToKick) {
				return interaction.reply({ content: 'Invalid user specified.', ephemeral: true });
			}

			const memberToKick = channel.members.get(userToKick.id);

			if (!memberToKick) {
				return interaction.reply({ content: `\`${userToKick.username}\` is not in the same voice channel.`, ephemeral: true });
			}

			try {
				await memberToKick.voice.setChannel(null);

				return interaction.reply({ content: `\`${userToKick.username}\` has been kicked from the voice channel.`, ephemeral: true });
			}
			catch (error) {
				console.error('Failed to kick user from the channel:', error);
				return interaction.reply({ content: 'An error occurred while kicking the user from the channel.', ephemeral: true });
			}
		} else if (subcommand === 'ban') {
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
		}
	},
};