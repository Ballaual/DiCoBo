const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const distube = require('../../distubeClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Jumps to a song number in the queue and skip the rest')
		.setDMPermission(false)
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The music"s ID in the queue')
				.setRequired(true)),
	category: 'music',
	async execute(interaction) {
		const musicId = interaction.options.getInteger('id');
		const queue = await distube.getQueue(interaction);
		const voiceChannelId = interaction.member.voice.channelId;

		if (!voiceChannelId) {
			return interaction.reply({
				content: 'Please join a voice channel first!',
				ephemeral: true,
			});
		}

		if (!queue) {
			const queueError = new EmbedBuilder()
				.setDescription('There is Nothing There is currently nothing to skip!')
				.setColor('FF0000');
			return interaction.reply({ embeds: [queueError] });
		}

		const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

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

		try {
			await distube.jump(interaction, parseInt(musicId));
			await interaction.reply(`⏩ | ***Jumped to song number ${musicId} in the queue***`);
		}
		catch (error) {
			return interaction.reply({ content: 'Invalid song ID!)', ephemeral: true });
		}
	},
};
