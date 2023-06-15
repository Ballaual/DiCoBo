const { SlashCommandBuilder } = require('discord.js');
const distube = require('../../distubeClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays music from Youtube, Spotify, Soundcloud, or Deezer')
    .setDMPermission(false)
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search the song you want to play | Supported URL: Youtube, Spotify, Soundcloud, Deezer')
        .setRequired(true)),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    const query = interaction.options.getString('query');

    const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
    if (botMember.voice?.channelId) {

      const botVoiceChannelId = botMember.voice.channelId;
      if (voiceChannel?.id !== botVoiceChannelId) {
        return interaction.reply({ content: 'You need to be in the same voice channel as the bot to use this command!', ephemeral: true });
      }
    } 

      if (!voiceChannel) {
        return interaction.reply({ content: 'Please join a voice channel first!', ephemeral: true });
    }

    await interaction.reply('🔍 **Searching and collecting songs...**');
    await interaction.editReply('Searching done :ok_hand:');

    try {
      await distube.play(voiceChannel, query, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
    } catch (error) {
      console.error(error);
      if (error.errorCode === 'YTDLP_ERROR' && error.message.includes('DRM protection')) {
        interaction.followUp('❌ | The requested song is DRM protected and cannot be played!');
      } else if (error.errorCode === 'SPOTIFY_API_ERROR' && error.message.includes('URL is private')) {
        interaction.followUp('❌ | The requested Spotify playlist is set to private!');
      }
    }
  },
};
