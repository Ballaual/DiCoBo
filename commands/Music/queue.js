const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const distube = require("../../distubeClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current songs in the music queue"),
  
  async execute(interaction) {
    const queue = await distube.getQueue(interaction);

    if (!queue) {
      const queueError = new EmbedBuilder()
        .setDescription("There is currently no song in the queue!")
        .setColor("#FF0000");

      return interaction.reply({ embeds: [queueError], ephemeral: true });
    }

    const queueItems = queue.songs.map((song, i) => {
      return `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
    });

    const chunkSize = 10; // Number of items to print in each message
    const chunkedQueue = [];

    for (let i = 0; i < queueItems.length; i += chunkSize) {
      chunkedQueue.push(queueItems.slice(i, i + chunkSize));
    }

    for (let i = 0; i < chunkedQueue.length; i++) {
      const embed = new EmbedBuilder()
        .setDescription(`**Current queue: **\n\n${chunkedQueue[i].join("\n")}`)
        .setColor("#FFFF00");

      if (i === 0) {
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.followUp({ embeds: [embed] });
      }
    }
  }
};
