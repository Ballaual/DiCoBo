const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave voice channel"),

    async execute (interaction) {
        const voiceChannel = interaction.member.voice.channel

        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel!", ephemeral: true })
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })

        connection.destroy()
        await interaction.reply("***Successfully left the voice channel***")
    }
}
