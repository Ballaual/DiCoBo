const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const getGuildFilePath = (guildId) => `./config/dvc/${guildId}.json`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dvc')
		.setDescription('Defines a voice channel as voice creator')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Sets a voice channel as voice creator')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('Select')
						.setRequired(true),
				)
				.addChannelOption(option =>
					option
						.setName('category')
						.setDescription('The channel category where the user channel gets created')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes a voice channel as voice creator and the channel itself')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to be removed')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('show-userchannels')
				.setDescription('Shows all created user channels'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('show-creator')
				.setDescription('Shows all creator channels and their categories'),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const guildId = interaction.guildId;
		const filePath = getGuildFilePath(guildId);

		try {
			if (subcommand === 'add') {
				const channelId = interaction.options.getChannel('channel').id;
				const categoryId = interaction.options.getChannel('category').id;

				let data = {};
				if (fs.existsSync(filePath)) {
					data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				}

				if (data.creatorChannels && data.creatorChannels.includes(channelId)) {
					return await interaction.reply({ content: 'The channel is already a voice creator.', ephemeral: true });
				}

				if (!data.creatorChannels) {
					data.creatorChannels = [];
				}
				data.creatorChannels.push(channelId);

				data.categories = data.categories || {};
				data.categories[channelId] = categoryId;

				fs.writeFileSync(filePath, JSON.stringify(data));

				await interaction.reply({ content: `Successfully set channel id: ${channelId} in category id: ${categoryId} as a voice creator.`, ephemeral: true });
			}
			else if (subcommand === 'remove') {
				const channelId = interaction.options.getChannel('channel').id;

				let data = {};
				if (fs.existsSync(filePath)) {
					data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				}

				if (!data.creatorChannels || !data.creatorChannels.includes(channelId)) {
					return await interaction.reply({ content: 'The channel is not a voice creator.', ephemeral: true });
				}

				data.creatorChannels = data.creatorChannels.filter(id => id !== channelId);

				if (data.categories && data.categories[channelId]) {
					delete data.categories[channelId];
				}

				fs.writeFileSync(filePath, JSON.stringify(data));

				await interaction.reply({ content: `Successfully removed channel id: ${channelId} as a voice creator.`, ephemeral: true });
			}
			else if (subcommand === 'show-userchannels') {
				let data = {};
				if (fs.existsSync(filePath)) {
					data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				}

				const userChannels = data.userChannels || {};
				const userChannelNames = Object.values(userChannels).map(channel => channel.name);

				if (userChannelNames.length === 0) {
					await interaction.reply('No user channels found.');
				}
				else {
					await interaction.reply(`User Channels: ${userChannelNames.join(', ')}`);
				}
			}
			else if (subcommand === 'show-creator') {
				let data = {};
				if (fs.existsSync(filePath)) {
					data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				}

				const creatorChannels = data.creatorChannels || [];
				const categories = data.categories || {};

				if (creatorChannels.length === 0) {
					await interaction.reply('No creator channels found.');
				}
				else {
					const creatorChannelsList = creatorChannels.map(channelId => {
						const categoryId = categories[channelId];
						return `${channelId} (${categoryId})`;
					});

					await interaction.reply(`Creator Channels: ${creatorChannelsList.join(', ')}`);
				}
			}
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An internal error occurred.', ephemeral: true });
		}
	},
};
