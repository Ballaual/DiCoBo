const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const distube = require("../../distubeClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the current music queue"),
    async execute (interaction) {
        const queue = await distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice?.channel

        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel!", ephemeral: true })
        }

        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("#FF0000")

            return interaction.reply({ embeds: [queueError] })
        }

        // FIX needed
        /* if (interaction.member.guild.me.voiceChannel.channelId !== voiceChannel.id) {
      return interaction.reply({ content: "You are not on the same voice channel as me!", ephemeral: true });
    } */

        const q = queue.songs.map((song, i) => {
            return `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``
        }).join("\n")

        const embed = new EmbedBuilder()
            .setDescription(`**Current queue: ** \n\n  ${q}`)
            .setColor("#FFFF00")

        interaction.reply({ embeds: [embed] })
    }
}
