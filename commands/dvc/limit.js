const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('limit')
		.setDescription('Sets the user limit for the voice channel.')
		.setDMPermission(false)
		.addIntegerOption(option =>
			option.setName('limit')
				.setDescription('The user limit for the voice channel.')
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
	},
};
