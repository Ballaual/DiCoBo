const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permit')
		.setDescription('Allows users to join the locked channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user1')
				.setDescription('The first user to allow access to the locked channel.')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('user2')
				.setDescription('The second user to allow access to the locked channel.')
				.setRequired(false))
		.addUserOption(option =>
			option.setName('user3')
				.setDescription('The third user to allow access to the locked channel.')
				.setRequired(false))
		.addUserOption(option =>
			option.setName('user4')
				.setDescription('The fourth user to allow access to the locked channel.')
				.setRequired(false))
		.addUserOption(option =>
			option.setName('user5')
				.setDescription('The fifth user to allow access to the locked channel.')
				.setRequired(false)),

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

		const permittedUsers = [];
		const userOptions = ['user1', 'user2', 'user3', 'user4', 'user5'];

		for (const option of userOptions) {
			const userToPermit = interaction.options.getUser(option);

			if (userToPermit) {
				try {
					await channel.permissionOverwrites.create(userToPermit, {
						Connect: true,
						ViewChannel: true,
					});
					permittedUsers.push(userToPermit.username);
				}
				catch (error) {
					console.error('Failed to permit user to join the channel:', error);
				}
			}
		}

		if (permittedUsers.length === 0) {
			return interaction.reply({ content: 'No valid users specified for permitting.', ephemeral: true });
		}

		return interaction.reply({
			content: `\`${permittedUsers.join(', ')}\` ${permittedUsers.length === 1 ? 'has' : 'have'} been permitted to join the locked channel.`,
			ephemeral: true,
		});
	},
};
