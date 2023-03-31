const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get user avatar")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to get the avatar from")),
    cooldown: 5,
    async execute (interaction) {
        const user = interaction.options.getUser("user") || interaction.user
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}"s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setURL(user.avatarURL())
        await interaction.reply({ embeds: [embed] })
    }
}
