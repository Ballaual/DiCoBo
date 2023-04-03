const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const progressbar = require("string-progressbar")
const distube = require("../../distubeClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Changes the volume of the music player")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Percentage of the audio volume between 1 and 200")
                .setRequired(true)
        ),
    timeout: 5000,

    async execute(interaction) {
        const volume = interaction.options.getInteger("amount");
        const queue = await distube.getQueue(interaction);
        const voiceChannelId = interaction.member.voice.channelId;
      
        if (!voiceChannelId) {
          return interaction.reply({
            content: "Please join a voice channel first!",
            ephemeral: true,
          });
        }
      
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      
        if (!botMember.voice?.channelId) {
          return interaction.reply({
            content: "I am not currently in a voice channel!",
            ephemeral: true,
          });
        }
      
        const botVoiceChannelId = botMember.voice.channelId;
      
        if (voiceChannelId !== botVoiceChannelId) {
          return interaction.reply({
            content: "You need to be in the same voice channel as the bot to use this command!",
            ephemeral: true,
          });
        }
      
        if (!queue) {
          const queueError = new EmbedBuilder()
            .setDescription("There is currently nothing playing!")
            .setColor("#FF0000");
      
          return interaction.reply({ embeds: [queueError], ephemeral: true });
        }
      
        if (volume < 1 || volume > 200) {
          return interaction.reply({
            content: "Please enter a valid number (between 1 and 200)",
            ephemeral: true,
          });
        }
      
        await distube.setVolume(interaction, volume);
      
        const total = 200;
        const current = volume;
        const bar = progressbar.splitBar(total, current, 27, "▬", "🔘")[0];
      
        await interaction.reply(`Set the new volume to ${volume}%.`);
        await interaction.channel.send(bar);
      }                
}
