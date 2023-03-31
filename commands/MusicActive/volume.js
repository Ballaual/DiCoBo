const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const progressbar = require("string-progressbar")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change the music player's volume.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Percentage of the audio volume between 1 and 200")
                .setRequired(true)
        ),
    timeout: 5000,

    async execute (interaction, client) {
        const volume = interaction.options.getInteger("amount")
        const queue = await client.distube.getQueue(interaction)
        const voiceChannel = interaction.member.voice.channel
        // FIX needed
        // const connection = client.voice.connections.get(interaction.guild.id);

        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel!", ephemeral: true })
        }

        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("There is Nothing Playing")
                .setColor("#FF0000")

            return interaction.reply({ embeds: [queueError] })
        }

        // FIX needed
        /* if (!connection || connection.channel.id !== voiceChannel.id) {
      return interaction.reply({ content: "You are not on the same voice channel as me!", ephemeral: true });
    } */

        if (volume < 1 || volume > 200) {
            return interaction.reply({ content: "Please enter a valid number (between 1 and 200)", ephemeral: true })
        }

        await client.distube.setVolume(interaction, volume)

        const total = 200
        const current = volume
        const bar = progressbar.splitBar(total, current, 27, "▬", "🔘")[0]

        await interaction.reply(`Set the new volume to ${volume}%.`)
        await interaction.channel.send(bar)
    }
}
