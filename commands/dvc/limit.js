const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('limit')
		.setDescription('Sets the user limit for the voice channel.')
		.setDefaultPermission(false)
		.addIntegerOption(option =>
			option.setName('limit')
				.setDescription('The user limit for the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply('You must be in a voice channel to use this command.');
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply('You do not have permissions to manage this channel.');
		}

		const userLimit = interaction.options.getInteger('limit');

		if (userLimit === null || userLimit < 0) {
			return interaction.reply('Invalid user limit specified.');
		}

		try {
			await channel.setUserLimit(userLimit);

			const limit = userLimit === 0 ? 'unlimited' : userLimit.toString();

			const guildId = interaction.guild.id;
			const filePath = getGuildFilePath(guildId);

			if (fs.existsSync(filePath)) {
				const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const userChannels = data.userChannels || {};

				if (userChannels[channel.id]) {
					userChannels[channel.id].userLimit = userLimit;
				}

				fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));
			}

			return interaction.reply(`The user limit for the voice channel has been set to \`${limit}\`.`);
		}
		catch (error) {
			console.error('Failed to set user limit for the channel:', error);
			return interaction.reply('An error occurred while setting the user limit for the channel.');
		}
	},
};
