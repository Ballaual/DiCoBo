const { Events, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		try {
			const { user, guild } = member;
			const serverName = guild.name;

			const joinLeavesDir = './config/joinleave';
			const guildConfigFile = path.join(joinLeavesDir, `${guild.id}.json`);

			if (fs.existsSync(guildConfigFile)) {
				const configFileData = fs.readFileSync(guildConfigFile, 'utf-8');
				const guildConfig = JSON.parse(configFileData);
				const channelId = guildConfig.joinLeaveChannel;

				if (channelId) {
					const channel = guild.channels.cache.get(channelId);

					if (channel && channel.type === ChannelType.GuildText) {
						await channel.send(`:x: | ${user.toString()} left the server!`);
					} else {
						console.log('The specified join/leave channel is not a text channel.');
					}
				} else {
					console.log('No join/leave channel specified in the config file.');
				}
			}
		} catch (error) {
			console.error('There was an error:', error);
		}
	},
};
