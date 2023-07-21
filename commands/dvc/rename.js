const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Renames the voice channel.')
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The new name for the voice channel.')
				.setRequired(true)),

	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.user).has(PermissionsBitField.Flags.ManageChannels)) {
			return interaction.reply({ content: 'You do not have permissions to manage this channel.', ephemeral: true });
		}

		const newName = interaction.options.getString('name');

		if (!newName) {
			return interaction.reply({ content: 'Invalid channel name specified.', ephemeral: true });
		}

		try {
			await channel.setName(newName);

			const guildId = interaction.guild.id;
			const filePath = getGuildFilePath(guildId);

			if (fs.existsSync(filePath)) {
				const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const userChannels = data.userChannels || {};

				if (userChannels[channel.id]) {
					userChannels[channel.id].channelName = newName;
				}

				fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));
			}

			return interaction.reply({ content: `The voice channel has been renamed to \`${newName}\`.`, ephemeral: true });
		}
		catch (error) {
			console.error('Failed to rename the voice channel:', error);
			return interaction.reply({ content: 'An error occurred while renaming the voice channel.', ephemeral: true });
		}
	},
};
