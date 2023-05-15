const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guilds")
        .setDescription("Displays the top 50 guilds the bot is in"),
    category: "misc",
    async execute (interaction) {
        const guilds = interaction.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .first(50)
        const description = guilds.map((guild, index) => {
            return `${index + 1}) ${guild.name} | ${guild.memberCount} members | ID:${guild.id} `
        }).join("\n")
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.username}'s Top 50 servers`)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor("#FFFF00")
            .setDescription(description)
        interaction.reply({ embeds: [embed] })
    }
}