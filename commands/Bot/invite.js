const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Displays the invite link for the bot."),

    async execute (interaction) {
        if (!process.env.oauthv2link) {
            return interaction.reply({ content: "Missing `oauthv2link` in .env", ephemeral: true })
        }

        if (!process.env.oauthv2link.startsWith("https://discord.com/")) {
            return interaction.reply({ content: "Please provide a valid OAuth2 link", ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.username}'s invite link:`)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor("#007BFF")
            .setDescription(`My invite link is:\n${process.env.oauthv2link}`)

        return interaction.reply({ embeds: [embed] })
    }
}
