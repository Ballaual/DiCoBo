const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Playing music")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("The song you want to play | Supported url: youtube,soundcloud,spotify")
                .setRequired(true)),
    async execute (interaction, client) {
        const voiceChannel = interaction.member.voice.channel
        // const queue = await client.distube.getQueue(interaction)
        const query = interaction.options.getString("query")
        if (!voiceChannel) {
            return interaction.reply({ content: "Please join a voice channel!", ephemeral: true })
        }

        // FIX needed
        /* if (queue) {
            if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.reply({ content: "You are not on the same voice channel as me!", ephemeral: true })
            }
        } */

        await interaction.reply("🔍 **Searching and attempting...**")
        await interaction.editReply("Searching done :ok_hand: ")
        client.distube.play(voiceChannel, query, {
            textChannel: interaction.channel,
            member: interaction.member
        })
    }
}
