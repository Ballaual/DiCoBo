const { SlashCommandBuilder } = require("@discordjs/builders")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const { EmbedBuilder } = require("discord.js")
require("dotenv").config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bots global slash commands"),
    async execute (interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            const errorEmbed = new EmbedBuilder()
                .setColor("##FF0000")
                .setDescription("You don\"t have permission to use this command.")
            return interaction.reply({ embeds: [errorEmbed] })
        }

        const rest = new REST({ version: "10" }).setToken(process.env.token)

        try {
            await rest.put(
                Routes.applicationCommands(process.env.botID),
                { body: interaction.client.commands.map((command) => command.data.toJSON()) }
            )

            const successEmbed = new EmbedBuilder()
                .setColor("#00FF00")
                .setDescription("Global slash commands have been reloaded.")
            return interaction.reply({ embeds: [successEmbed] })
        } catch (error) {
            console.error(error)
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription("An error occurred while reloading global slash commands.")
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}
