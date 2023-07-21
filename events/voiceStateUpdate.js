const { Events, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const directory = './config/dvc';
const getGuildFilePath = (guildId) => path.join(directory, `${guildId}.json`);

if (!fs.existsSync(directory)) {
	fs.mkdirSync(directory, { recursive: true });
}

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const guildId = newState.guild.id;
		const filePath = getGuildFilePath(guildId);

		let data = {};
		if (fs.existsSync(filePath)) {
			data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		}
		else {
			const initialData = {
				creatorChannels: [],
				categories: {},
				userChannels: {},
			};
			fs.writeFileSync(filePath, JSON.stringify(initialData));
		}

		const creatorChannels = data.creatorChannels;
		const categories = data.categories;
		const userChannels = data.userChannels || {};

		if (
			newState.channel &&
			creatorChannels.includes(newState.channel.id) &&
			newState.channel.members.size === 1
		) {
			const guild = newState.guild;
			const user = newState.member.user;

			const categoryId = categories[newState.channel.id];
			const category = guild.channels.cache.get(categoryId);

			if (category && category.type === ChannelType.GuildCategory) {
				const parentOverwrites = newState.channel.parent.permissionOverwrites.cache;
				const permissionOverwrites = [];

				parentOverwrites.forEach((overwrite) => {
					permissionOverwrites.push({
						id: overwrite.id,
						allow: overwrite.allow.bitfield,
						deny: overwrite.deny.bitfield,
					});
				});

				permissionOverwrites.push({
					id: user.id,
					allow: [],
				});

				const newChannel = await guild.channels.create({
					name: `${newState.member.displayName}'s VC`,
					type: ChannelType.GuildVoice,
					parent: category,
					userLimit: newState.channel.userLimit,
					bitrate: newState.channel.bitrate,
					permissionOverwrites,
				});

				newState.setChannel(newChannel);

				const creatorChannel = guild.channels.cache.get(newState.channel.id);
				if (creatorChannel) {
					userChannels[newChannel.id] = {
						creatorChannelId: creatorChannel.id,
						channelOwnerId: user.id,
						channelOwnerName: user.username,
						channelName: newChannel.name,
						userLimit: newState.channel.userLimit,
						isLocked: false,
					};
				}
			}
		}

		if (
			oldState.channel &&
			oldState.member.user.id === newState.member.user.id
		) {
			if (
				oldState.channel.members.size === 0 &&
				userChannels[oldState.channel.id]
			) {
				const channelData = userChannels[oldState.channel.id];
				if (channelData.channelOwnerId === oldState.member.user.id) {
					const creatorChannel = newState.guild.channels.cache.get(
						channelData.creatorChannelId,
					);
					if (creatorChannel) {
						try {
							delete userChannels[oldState.channel.id];
							await oldState.channel.delete();
						}
						catch (error) {
							console.error(`Failed to delete channel: ${error.message}`);
						}
					}
				}
			}
			else if (
				oldState.channel.members.size > 0 &&
				userChannels[oldState.channel.id] &&
				!oldState.selfMute &&
				!oldState.selfDeaf &&
				!oldState.selfStream &&
				!newState.selfMute &&
				!newState.selfDeaf &&
				!newState.selfStream
			) {
				const nextMember = oldState.channel.members.first();
				const channelData = userChannels[oldState.channel.id];

				if (channelData.channelOwnerId === oldState.member.user.id) {
					await oldState.channel.permissionOverwrites.edit(nextMember, {});

					await oldState.channel.permissionOverwrites.delete(oldState.member);

					let newChannelName = `${nextMember.displayName}'s VC`;
					if (channelData.isLocked) {
						newChannelName = `Locked | ${nextMember.displayName}'s VC`;
					}

					await oldState.channel.edit({ name: newChannelName });

					data.userChannels[oldState.channel.id].channelOwnerId = nextMember.id;
					data.userChannels[oldState.channel.id].channelOwnerName =
						nextMember.user.username;
					data.userChannels[oldState.channel.id].channelName = newChannelName;
				}
			}
		}

		const guild = newState.guild;
		const channelsToDelete = [];

		for (const channelId in userChannels) {
			const channelData = userChannels[channelId];
			const channel = guild.channels.cache.get(channelId);

			if (!channel) {
				delete userChannels[channelId];
				continue;
			}

			if (channel.members.size === 0) {
				if (channelData.channelOwnerId !== newState.member.user.id) {
					channelsToDelete.push(channel);
					delete userChannels[channelId];
				}
			}
		}

		for (const channel of channelsToDelete) {
			try {
				await channel.delete();
			}
			catch (error) {
				console.error(`Failed to delete channel: ${error.message}`);
			}
		}

		fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));
	},
};
