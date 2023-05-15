const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poke")
        .setDescription("Sends a poke to another user")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user you want to poke")
                .setRequired(true))
                .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message you want to send")
                .setRequired(false)
                .setMaxLength(1024)
        ),
    category: 'util',
    async execute (interaction) {
        const target = interaction.options.getUser("target")
        const message = interaction.options.getString("message") || " "
        const serverName = interaction.guild.name
        const senderName = interaction.user.username

        // Check if the target user is the bot itself
        if (target.id === interaction.client.user.id) {
            const errorMessage = "Sorry, you cannot poke me!"
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("Error")
                .setDescription(errorMessage)
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return
        }

        // Send a DM to the target user
        target.send(
            `You've been poked by **${senderName}** from **${serverName}**!\nMessage: ${message}`
        )

        // Send confirmation to the user who initiated the command
        const embed = new EmbedBuilder()
            .setColor("#00FF0C")
            .setTitle("Poke Sent")
            .setDescription(`Successfully sent a poke to **${target.username}**.`)
            .addFields({ name: "Message", value: message || " " })
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}
