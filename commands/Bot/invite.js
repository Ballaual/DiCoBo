const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Displays the invite link of the bot"),

    async execute (interaction) {
        if (!process.env.oauthv2Link) {
            return interaction.reply({ content: "Missing `oauthv2Link` in .env", ephemeral: true })
        }

        if (!process.env.oauthv2Link.startsWith("https://discord.com/")) {
            return interaction.reply({ content: "Please provide a valid OAuth2 link", ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.username}'s invite link:`)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor("#007BFF")
            .setDescription(`You can invite me with the following link:\n${process.env.oauthv2Link}`)

        return interaction.reply({ embeds: [embed] })
    }
}
