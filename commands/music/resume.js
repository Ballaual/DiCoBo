const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const distube = require('../../distubeClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the paused track')
		.setDMPermission(false),
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
				content: 'You need to be in the same voice channel as the bot to use this command!',
				ephemeral: true,
			});
		}

		if (!queue) {
			const queueError = new EmbedBuilder()
				.setDescription('There is currently nothing to resume!')
				.setColor('#FF0000');

			return interaction.reply({ embeds: [queueError], ephemeral: true });
		}

		if (queue.playing) {
			return interaction.reply({
				content: 'The track is already playing!',
				ephemeral: true,
			});
		}

		try {
			await distube.resume(interaction);
			await interaction.reply('▶️ | ***Resumed the current track***');
		}
		catch (error) {
			console.error(error);
			return interaction.reply({
				content: 'An error occurred while pausing the queue',
				ephemeral: true,
			});
		}
	},
};
