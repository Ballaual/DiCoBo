const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Displays the donation link"),

    async execute (interaction) {

        const embed = new EmbedBuilder()
            .setTitle(`Support ${interaction.client.user.username}!`)
            .setThumbnail("https://cdn.discordapp.com/emojis/1092421597211656262.png")
            .setColor("#007BFF")
            .setDescription(`You like the bot and want to support me?
            You can donate via Paypal:
            https://www.paypal.com/paypalme/aballauf`)

        return interaction.reply({ embeds: [embed] })
    }
}
