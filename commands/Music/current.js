const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const distube = require('../../distubeClient');

const status = (queue) => {
	const filterText = Array.isArray(queue.filters) ? queue.filters.join(', ') : 'Off';
	return `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\` | Filter: \`${filterText}\``;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Displays information about the current track is playing')
		.setDMPermission(false),
	category: 'music',
	async execute(interaction) {
		const queue = await distube.getQueue(interaction);
		const voiceChannelId = interaction.member.voice.channelId;

		if (!voiceChannelId) {
			return interaction.reply({
				content: 'Please join a voice channel first!',
				ephemeral: true,
			});
		}

		const botMember = interaction.guild.members.cache.get(
			interaction.client.user.id,
		);

		if (!botMember.voice?.channelId) {
			return interaction.reply({
				content: 'I am not currently in a voice channel!',
				ephemeral: true,
			});
		}

		const botVoiceChannelId = botMember.voice.channelId;

		if (voiceChannelId !== botVoiceChannelId) {
			return interaction.reply({
				content:
          'You need to be in the same voice channel as the bot to use this command!',
				ephemeral: true,
			});
		}

		if (!queue) {
			const queueError = new EmbedBuilder()
				.setDescription('There is currently nothing playing!')
				.setColor('#FF0000');

			return interaction.reply({ embeds: [queueError], ephemeral: true });
		}

		const song = queue.songs[0];
		const embed = new EmbedBuilder()
			.setColor('#7200FF')
			.setAuthor({
				name: 'Now Playing',
				iconURL:
          'https://raw.githubusercontent.com/ballaual/DiCoBo/master/assets/music.gif',
			})
			.setThumbnail(song.thumbnail)
			.setDescription(`[${song.name}](${song.url})`)
			.addFields(
				{ name: '**Views:**', value: song.views.toString(), inline: true },
				{ name: '**Likes:**', value: song.likes.toString(), inline: true },
				{ name: '**Duration:**', value: song.formattedDuration.toString(), inline: true },
				{ name: '**Status**', value: status(queue).toString() })
			.setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.avatarURL() })
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	},
};
