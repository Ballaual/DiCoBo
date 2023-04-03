const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const distube = require("../../distubeClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the current music queue"),
    async execute (interaction) {
        const queue = await distube.getQueue(interaction)

        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("There is currently no song in the queue!")
                .setColor("#FF0000")

            return interaction.reply({ embeds: [queueError], ephemeral: true })
        }

        const q = queue.songs.map((song, i) => {
            return `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``
        }).join("\n")

        const embed = new EmbedBuilder()
            .setDescription(`**Current queue: ** \n\n  ${q}`)
            .setColor("#FFFF00")

        interaction.reply({ embeds: [embed] })
    }
}
