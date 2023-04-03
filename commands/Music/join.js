const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("The bot joins the users voice channel to play some music"),

    async execute (interaction) {
        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return interaction.reply({
                content: "Please join a voice channel!",
                ephemeral: true
            })
        }

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })
            await interaction.reply("***Successfully joined the voice channel***")
        } catch (error) {
            return interaction.reply({
                content: `There was an error connecting to the voice channel: ${error}`,
                ephemeral: true
            })
        }
    }
}
