const { SlashCommandBuilder } = require("@discordjs/builders")
const fs = require("fs")
const path = require("path")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list with every command available"),
    async execute (interaction) {
        const commandFolders = fs.readdirSync(path.join(__dirname, "..", "..", "commands")).filter(folder => folder !== "Inactive")
        const commands = []

        for (const folder of commandFolders) {
            const folderCommands = fs.readdirSync(path.join(__dirname, "..", "..", "commands", folder)).filter(file => file.endsWith(".js"))
            for (const file of folderCommands) {
                try {
                    const command = require(path.join(__dirname, "..", "..", "commands", folder, file))
                    if (command.data) {
                        commands.push(command.data.toJSON())
                    } else {
                        console.log(`Command file ${file} in folder ${folder} doesn"t have a data property.`)
                    }
                } catch (error) {
                    console.log(`Error loading command file ${file} in folder ${folder}: ${error}`)
                }
            }
        }

        const sortedCommands = commands.sort((a, b) => a.name.localeCompare(b.name))

        const embed = new EmbedBuilder()
            .setColor("#0000ff")
            .setTitle("Available (/) commands")
            .addFields(sortedCommands.map(command => ({
                name: `/${command.name}`,
                value: command.description,
                inline: false
            })))

        await interaction.reply({ embeds: [embed] })
    }
}
