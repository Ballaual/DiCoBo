const fs = require("fs")
const path = require("node:path")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { AttachmentBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("log")
        .setDescription("Displays the command log"),
    async execute (interaction) {
        try {
            const serverId = interaction.guild.id
            const logFilePath = path.join(__dirname, "../../logs", `${serverId}.txt`)

            // Check if the log file exists for the server
            if (!fs.existsSync(logFilePath)) {
                await interaction.reply({ content: "There is no command log for this server.", ephemeral: true })
                return
            }

            // If the log file exists, create an attachment for it and send it
            const attachment = new AttachmentBuilder(logFilePath, `${serverId}.txt`)
            await interaction.reply({
                content: "Here is the command log:",
                files: [attachment],
                ephemeral: true
            })
        } catch (err) {
            console.error(err)
            await interaction.reply(
                "There was an error while fetching the command log."
            )
        }
    }
}
