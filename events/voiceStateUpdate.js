const { Events, ChannelType, PermissionsBitField } = require('discord.js');
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

			let existingChannel = guild.channels.cache.find(
				(channel) =>
					channel.name ===
          `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s VC`,
			);

			if (!existingChannel) {
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
						allow: [
							PermissionsBitField.Flags.ManageChannels,
							PermissionsBitField.Flags.ManageRoles,
						],
					});

					const newChannel = await guild.channels.create(
						{
							name: `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s VC`,
							type: ChannelType.GuildVoice,
							parent: category,
							userLimit: newState.channel.userLimit,
							bitrate: newState.channel.bitrate,
							permissionOverwrites,
						},
					);

					newState.setChannel(newChannel);

					const creatorChannel = guild.channels.cache.get(newState.channel.id);
					if (creatorChannel) {
						userChannels[newChannel.id] = {
							creatorChannelId: creatorChannel.id,
							channelOwner: user.id,
							name: newChannel.name,
						};

						existingChannel = newChannel;
					}
				}
			}
		}

		if (
			oldState.channel &&
      oldState.channel.name.includes(`${oldState.member.user.username.charAt(0).toUpperCase() + oldState.member.user.username.slice(1)}'s VC`) &&
      oldState.member.user.id === newState.member.user.id
		) {
			if (oldState.channel.members.size > 0) {
				const nextMember = oldState.channel.members.first();

				await oldState.channel.permissionOverwrites.edit(nextMember, {
					ManageChannels: true,
					ManageRoles: true,
				});

				await oldState.channel.permissionOverwrites.delete(oldState.member);

				await oldState.channel.edit({
					name: `${nextMember.user.username.charAt(0).toUpperCase() + nextMember.user.username.slice(1)}'s VC`,
				});

				if (userChannels[oldState.channel.id]) {
					userChannels[oldState.channel.id].name = oldState.channel.name;
					if (userChannels[oldState.channel.id].channelOwner === oldState.member.user.id) {
						userChannels[oldState.channel.id].channelOwner = nextMember.user.id;
					}
				}
			}
			else if (userChannels[oldState.channel.id]) {
				const creatorChannel = newState.guild.channels.cache.get(userChannels[oldState.channel.id].creatorChannelId);
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

		fs.writeFileSync(filePath, JSON.stringify({ ...data, userChannels }));
	},
};
