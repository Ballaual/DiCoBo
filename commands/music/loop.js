const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const distube = require('../../distubeClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loops through current song or the queue')
		.setDMPermission(false),
	async execute(interaction) {
		const queue = await distube.getQueue(interaction);
		const voiceChannel = interaction.member.voice.channel;
		const botMember = interaction.guild.members.cache.get(
			interaction.client.user.id,
		);
		const botVoiceChannel = botMember?.voice.channel;

		if (!voiceChannel) {
			return interaction.reply({
				content: 'Please join a voice channel first!',
				ephemeral: true,
			});
		}

		if (!botVoiceChannel) {
			return interaction.reply({
				content: 'I am not currently in a voice channel!',
				ephemeral: true,
			});
		}

		if (voiceChannel !== botVoiceChannel) {
			return interaction.reply({
				content: 'You need to be in the same voice channel as the bot to use this command!',
				ephemeral: true,
			});
		}

		if (!queue) {
			const queueError = new EmbedBuilder()
				.setDescription('There is currently nothing to loop!')
				.setColor('#FF0000');

			return interaction.reply({ embeds: [queueError] });
		}

		const repeatMode = distube.setRepeatMode(interaction);
		const repeatMessage =
      repeatMode === 2 ? 'Repeat queue' : repeatMode ? 'Repeat song' : 'Off';

		return interaction.reply(`Set repeat mode to \`${repeatMessage}\``);
	},
};
