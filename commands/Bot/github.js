const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("Displays the github repository link for the bot"),

    async execute (interaction) {
        if (!process.env.githubLink) {
            return interaction.reply({ content: "Missing `githubLink` in .env", ephemeral: true })
        }

        if (!process.env.githubLink.startsWith("https://github.com/")) {
            return interaction.reply({ content: "Please provide a valid Github link", ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.client.user.username}'s Github Repository:`)
            .setThumbnail("https://cdn.discordapp.com/emojis/1091295909972803616.png")
            .setColor("#007BFF")
            .setDescription(`You can find the sourcecode here:\n${process.env.githubLink}`)

        return interaction.reply({ embeds: [embed] })
    }
}
