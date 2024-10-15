const Distube = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { DeezerPlugin } = require('@distube/deezer');
const { EmbedBuilder } = require('discord.js');
const discordClient = require('./discordClient');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

// Lese die Cookies aus einer JSON-Datei (z. B. cookies.json)
const cookies = JSON.parse(fs.readFileSync('cookies.json'));

// Erstelle den Agent mit den Cookies
const agent = ytdl.createAgent(cookies);

const distube = new Distube.default(discordClient, {
	plugins: [
		new YouTubePlugin(), // Add YouTube plugin
		new SoundCloudPlugin(),
		new SpotifyPlugin(),
		new DeezerPlugin(),
	],
});

// Erhöhe die Anzahl der maximalen Listener
distube.setMaxListeners(20); // Oder eine andere Zahl

const status = (queue) => {
	const filterText = Array.isArray(queue.filters) ? queue.filters.join(', ') : 'Off';
	return `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\` | Filter: \`${filterText}\``;
};

// Verwende die ytdlOptions beim Abrufen von Songs
distube
	.on('playSong', (queue, song) => {
		const embed = new EmbedBuilder()
			.setColor('#7200FF')
			.setAuthor({ name: 'Started Playing', iconURL: 'https://raw.githubusercontent.com/ballaual/DiCoBo/master/assets/music.gif' })
			.setThumbnail(song.thumbnail)
			.setDescription(`[${song.name}](${song.url})`)
			.addFields(
				{ name: '**Views:**', value: song.views.toString(), inline: true },
				{ name: '**Likes:**', value: song.likes.toString(), inline: true },
				{ name: '**Duration:**', value: song.formattedDuration.toString(), inline: true },
				{ name: '**Status**', value: status(queue).toString() }
			)
			.setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.avatarURL() })
			.setTimestamp();
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('addSong', (queue, song) => {
		const embed = new EmbedBuilder()
			.setTitle(':ballot_box_with_check: | Added song to queue')
			.setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` - Requested by ${song.user}`)
			.setColor('#7200FF')
			.setTimestamp();
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('addList', (queue, playlist) => {
		const embed = new EmbedBuilder()
			.setTitle(':ballot_box_with_check: | Add list')
			.setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`)
			.setColor('#7200FF')
			.setTimestamp();
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('error', (textChannel, e) => {
		console.error(e);
		textChannel.send(`An error encountered: ${e}`);
	})

	.on('finishSong', queue => {
		const embed = new EmbedBuilder()
			.setDescription(`:white_check_mark: | Finished playing \`${queue.songs[0].name}\``);
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('disconnect', queue => {
		const embed = new EmbedBuilder()
			.setDescription(':x: | Disconnected from voice channel');
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('empty', queue => {
		const embed = new EmbedBuilder()
			.setDescription(':x: | Channel is empty. Leaving the channel!');
		queue.textChannel.send({ embeds: [embed] });
	})

	.on('initQueue', (queue) => {
		queue.autoplay = false;
		queue.volume = 50;
	});

// Verwende ytdlOptions nur beim Abrufen von Songs
distube.on('playSong', async (queue, song) => {
	try {
		const songInfo = await ytdl.getInfo(song.url, { agent });
		// Hier kannst du die songInfo verwenden, um weitere Informationen zu erhalten
	} catch (error) {
		console.error(error);
	}
});

module.exports = distube;
