const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joinleavechannel')
		.setDescription('Sets the channel for join/leave messages')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a channel for join/leave messages')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to send join/leave messages')
						.setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes the saved channel for join/leave messages'),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const channelId = interaction.options.getChannel('channel');

		if (subcommand === 'add') {
			if (!channelId) {
				await interaction.reply({ content: 'Please provide a valid channel.', ephemeral: true });
				return;
			}

			const guildId = interaction.guildId;

			const joinLeavesDir = './config/joinleave';
			if (!fs.existsSync(joinLeavesDir)) {
				fs.mkdirSync(joinLeavesDir);
			}

			const guildConfigFile = path.join(joinLeavesDir, `${guildId}.json`);

			let guildConfig = {};
			if (fs.existsSync(guildConfigFile)) {
				const configFileData = fs.readFileSync(guildConfigFile, 'utf-8');
				guildConfig = JSON.parse(configFileData);
			}

			guildConfig.joinLeaveChannel = channelId.id;

			fs.writeFileSync(guildConfigFile, JSON.stringify(guildConfig, null, 4));

			await interaction.reply({ content: `Join/leave messages will now be sent to <#${channelId.id}>.`, ephemeral: true })
		}
		else if (subcommand === 'remove') {
			const guildId = interaction.guildId;
			const guildConfigFile = path.join('./config/joinleave', `${guildId}.json`);

			if (fs.existsSync(guildConfigFile)) {
				fs.unlinkSync(guildConfigFile);
				await interaction.reply({ content: 'Join/leave channel removed.', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There is no join/leave channel configured.', ephemeral: true });
			}
		}
	},
};
