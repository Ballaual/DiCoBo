const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const distube = require('../../distubeClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Displays the current songs in the music queue')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('clear')
				.setDescription('Clears the current queue'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('show')
				.setDescription('Shows the current queue'),
		)
		.setDMPermission(false),
	category: 'music',
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'clear') {
			const queue = await distube.getQueue(interaction);

			if (!queue) {
				const queueError = new EmbedBuilder()
					.setDescription('There is currently no song in the queue!')
					.setColor('#FF0000');

				return interaction.reply({ embeds: [queueError], ephemeral: true });
			}

			const playingSong = queue.songs[0];
			queue.songs = [playingSong];

			const queueCleared = new EmbedBuilder()
				.setDescription('The queue has been cleared!')
				.setColor('#00FF00');

			return interaction.reply({ embeds: [queueCleared] });
		}

		const queue = await distube.getQueue(interaction);

		if (!queue) {
			const queueError = new EmbedBuilder()
				.setDescription('There is currently no song in the queue!')
				.setColor('#FF0000');

			return interaction.reply({ embeds: [queueError], ephemeral: true });
		}

		if (subcommand === 'show') {
			const queueItems = queue.songs.map((song, i) => {
				return `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
			});

			const chunkSize = 10;
			const chunkedQueue = [];

			for (let i = 0; i < queueItems.length; i += chunkSize) {
				chunkedQueue.push(queueItems.slice(i, i + chunkSize));
			}

			for (let i = 0; i < chunkedQueue.length; i++) {
				const currentPart = i + 1;
				const totalParts = chunkedQueue.length;
				const embed = new EmbedBuilder()
					.setTitle(`**Current queue (Part ${currentPart}/${totalParts})**`)
					.setDescription(`\n\n${chunkedQueue[i].join('\n')}`)
					.setColor('#FFFF00');

				if (i === 0) {
					await interaction.reply({ embeds: [embed] });
				}
				else {
					await interaction.followUp({ embeds: [embed] });
				}
			}
		}
	},
};
