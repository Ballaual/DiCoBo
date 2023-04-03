const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("The bot leaves the current voice channel"),

    async execute (interaction) {
        const voiceChannel = interaction.member.voice.channel
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id)

        if (!voiceChannel && !botMember.voice?.channelId) {
            return interaction.reply({
                content: "The bot is currently not in a voice channel.",
                ephemeral: true
            })
        } else if (voiceChannel && !botMember.voice?.channelId) {
            return interaction.reply({
                content: "I am not currently in a voice channel!",
                ephemeral: true
            })
        } else if (!voiceChannel) {
            return interaction.reply({
                content: "You need to be in the same voice channel as the bot to use this command!",
                ephemeral: true
            })
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })

        if (!connection) {
            return interaction.reply({
                content: "I am not currently in a voice channel!",
                ephemeral: true
            })
        }

        connection.destroy()
        await interaction.reply(`***Successfully left the voice channel ${voiceChannel.name}***`)
    }
}
