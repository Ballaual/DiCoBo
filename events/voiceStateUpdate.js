const { Events, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const directory = './config';
const filePath = path.join(directory, 'dvc.json');

if (!fs.existsSync(directory)) {
	fs.mkdirSync(directory);
}

if (!fs.existsSync(filePath)) {
	const initialData = {
		creatorChannels: [],
		categories: {},
		userChannels: {},
	};
	fs.writeFileSync(filePath, JSON.stringify(initialData));
}

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const creatorChannels = data.creatorChannels;
		const categories = data.categories;
		const userChannels = data.userChannels;

		if (newState.channel && creatorChannels.includes(newState.channel.id) && newState.channel.members.size === 1) {
			const guild = newState.guild;
			const user = newState.member.user;

			let existingChannel = guild.channels.cache.find(channel => channel.name === `${user.username}'s Channel`);

			if (!existingChannel) {
				const categoryId = categories[newState.channel.id];
				const category = guild.channels.cache.get(categoryId);

				if (category && category.type === ChannelType.GuildCategory) {
					const newChannel = await guild.channels.create({
						name: `${user.username}'s Channel`,
						type: ChannelType.GuildVoice,
						parent: category,
						userLimit: newState.channel.userLimit,
						bitrate: newState.channel.bitrate,
						permissionOverwrites: [
							{
								id: user.id,
								allow: [PermissionsBitField.Flags.ManageChannels],
							},
						],
					});

					newState.setChannel(newChannel);

					const creatorChannel = guild.channels.cache.get(newState.channel.id);
					if (creatorChannel) {
						userChannels[newChannel.id] = {
							creatorChannelId: creatorChannel.id,
						};

						existingChannel = newChannel;
					}
				}
			}
		}

		if (
			oldState.channel &&
      oldState.channel.name.includes(`${oldState.member.user.username}'s Channel`) &&
      oldState.channel.members.size === 0 &&
      oldState.member.user.id === newState.member.user.id
		) {
			oldState.channel.delete();

			if (userChannels[oldState.channel.id]) {
				const creatorChannel = newState.guild.channels.cache.get(userChannels[oldState.channel.id].creatorChannelId);
				if (creatorChannel) {
					delete userChannels[oldState.channel.id];
				}
			}
		}

		fs.writeFileSync(filePath, JSON.stringify(data));
	},
};