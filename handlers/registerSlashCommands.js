const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const fs = require("fs")
const path = require("path")
const { Collection } = require("discord.js")
const commands = new Collection()
const commandsPath = path.join(__dirname, "..", "commands")

const registerSlashCommands = (client) => {
    const findCommandFiles = (dir) => {
        const files = fs.readdirSync(dir)
        for (const file of files) {
            const filePath = path.join(dir, file)
            if (fs.lstatSync(filePath).isDirectory()) {
                findCommandFiles(filePath)
            } else if (file.endsWith(".js")) {
                const command = require(filePath)
                console.log("\x1b[36m%s\x1b[0m", "|Loaded|" + path.basename(filePath))
                if (command.data && command.data.name) {
                    commands.set(command.data.name, command)
                }
            }
        }
    }

    findCommandFiles(commandsPath)

    client.commands = commands

    const rest = new REST({ version: "10" }).setToken(process.env.token);

    (async () => {
        try {
            console.log("\x1b[31m%s\x1b[0m", `Start register ${client.commands.size} application (/) commands to the Discord API.`)
            const data = await rest.put(
                Routes.applicationCommands(process.env.botID),
                { body: client.commands.map((command) => command.data.toJSON()) }
            )
            console.log("\x1b[31m%s\x1b[0m", `Successfully registered ${data.length} application (/) commands to the Discord API!`)
        } catch (error) {
            console.error(error)
        }
    })()
}

module.exports = registerSlashCommands
