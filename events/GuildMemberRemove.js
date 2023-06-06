const { Events, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		try {
			const { user, guild } = member;

			const joinLeavesDir = './config/joinleave';
			const guildConfigFile = path.join(joinLeavesDir, `${guild.id}.json`);

			if (fs.existsSync(guildConfigFile)) {
				const configFileData = fs.readFileSync(guildConfigFile, 'utf-8');
				const guildConfig = JSON.parse(configFileData);
				const channelId = guildConfig.joinLeaveChannel;

				if (channelId) {
					const channel = guild.channels.cache.get(channelId);

					if (channel && channel.type === ChannelType.GuildText) {
						const embed = new EmbedBuilder()
							.setTitle(`${user.username} left the server`)
							.setColor('#FF0000')
							.setURL(`https://discord.com/users/${user.id}`)
							.setThumbnail(user.displayAvatarURL())
							.addFields(
								{ name: 'User ID', value: user.id, inline: true },
								{ name: 'User Tag', value: user.tag, inline: true },
								{ name: 'Avatar URL', value: user.displayAvatarURL({ dynamic: true }) },
								{ name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true },
								{ name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
							);

						await channel.send({ embeds: [embed] });
					}
					else {
						console.log('The specified join/leave channel is not a text channel.');
					}
				}
				else {
					console.log('No join/leave channel specified in the config file.');
				}
			}
		}
		catch (error) {
			console.error('There was an error:', error);
		}
	},
};
