const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dvc')
		.setDescription('Defines a voice channel as voice creator')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Sets a voice channel as voice cretor')
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
		),
	category: 'dvc',
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		try {
			if (subcommand === 'add') {
				const channelId = interaction.options.getChannel('channel').id;
				const categoryId = interaction.options.getChannel('category').id;

				const data = JSON.parse(fs.readFileSync('./config/dvc.json', 'utf8'));

				if (data.creatorChannels && data.creatorChannels.includes(channelId)) {
					return await interaction.reply({ content: 'The channel is already a voice creator.', ephemeral:true });
				}

				if (!data.creatorChannels) {
					data.creatorChannels = [];
				}
				data.creatorChannels.push(channelId);

				data.categories = data.categories || {};
				data.categories[channelId] = categoryId;

				fs.writeFileSync('./config/dvc.json', JSON.stringify(data));

				await interaction.reply({ content: `Successfully set channel id: ${channelId} in category id: ${categoryId} as a voice creator.`, ephemeral: true });
			}
			else if (subcommand === 'remove') {
				const channelId = interaction.options.getChannel('channel').id;

				const data = JSON.parse(fs.readFileSync('./config/dvc.json', 'utf8'));

				if (!data.creatorChannels || !data.creatorChannels.includes(channelId)) {
					return await interaction.reply({ content:'The channel is no voice creator.', ephemeral: true });
				}

				data.creatorChannels = data.creatorChannels.filter(id => id !== channelId);

				if (data.categories && data.categories[channelId]) {
					delete data.categories[channelId];
				}

				fs.writeFileSync('./config/dvc.json', JSON.stringify(data));

				const guild = interaction.guild;
				const channel = guild.channels.cache.get(channelId);
				if (channel) {
					channel.delete();
				}

				await interaction.reply({ content:'Voice creator successfully removed.', ephemeral: true });
			}
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content:'An internal error occured.', ephemeral: true });
		}
	},
};
