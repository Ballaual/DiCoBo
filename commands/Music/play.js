const { SlashCommandBuilder } = require("@discordjs/builders")
const distube = require("../../distubeClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays music from Youtube, Spotify, Soundcloud or Deezer")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Search the song you want to play | Supported url: Youtube, Spotify, Soundcloud, Deezer")
                .setRequired(true)),
    async execute (interaction) {
        const voiceChannel = interaction.member.voice.channel
        const query = interaction.options.getString("query")
        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel first!", ephemeral: true })
        }

        await interaction.reply("🔍 **Searching and attempting...**")
        await interaction.editReply("Searching done :ok_hand: ")
        distube.play(voiceChannel, query, {
            textChannel: interaction.channel,
            member: interaction.member
        })
    }
}
