const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { donate } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Displays the donation link"),
    category: "misc",
    async execute (interaction) {
        if (!donate) {
            return interaction.reply({ content: "Missing `donate` parameter in config.json", ephemeral: true })
        }

        if (!donate.startsWith("https://paypal.com/")) {
            return interaction.reply({ content: "Please provide a valid Paypal link", ephemeral: true })
        }

        const embed = new EmbedBuilder()
            .setTitle("Thank you for donating!")
            .setThumbnail("https://cdn.discordapp.com/emojis/1092421597211656262.png")
            .setColor("#007BFF")
            .setDescription(`You like the bot and want to support me?
            You can donate via Paypal:\n${donate}`)

        return interaction.reply({ embeds: [embed] })
    }
}