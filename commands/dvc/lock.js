const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks the current voice channel for everyone.')
		.setDMPermission(false),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({ content: 'You do not have permissions to manage this channel.', ephemeral: true });
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

			const guildId = interaction.guild.id;
			const filePath = getGuildFilePath(guildId);

			if (fs.existsSync(filePath)) {
				const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const userChannels = data.userChannels || {};

				if (!userChannels[channel.id]) {
					userChannels[channel.id] = {
						channelName: newChannelName,
						isLocked: true,
					};
				}

				fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));
			}

			return interaction.reply({ content: 'The channel has been locked for everyone.', ephemeral: true });
		}
		catch (error) {
			console.error('Failed to lock channel:', error);
			return interaction.reply({ content: 'An error occurred while locking the channel.', ephemeral: true });
		}
	},
};
