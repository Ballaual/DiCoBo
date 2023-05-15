const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns latency and API ping"),
	category: "misc",
    async execute (interaction) {
        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("PONG! :ping_pong:")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: "Latency", value: `\`${Date.now() - interaction.createdTimestamp}ms\`` },
                { name: "API Latency", value: `\`${Math.round(interaction.client.ws.ping)}ms\`` }
            )
        await interaction.reply({ embeds: [embed] })
    }
}