const logCommand = require("./commandLogger")

const executeInteraction = (interaction, commands) => {
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
    }

    command
        .execute(interaction)
        .then(() => {
            logCommand(command.data.name, interaction.user.tag, interaction.guildId)
        })
        .catch((error) => {
            logCommand(command.data.name, interaction.user.tag, interaction.guildId)
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                })
            } else {
                interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                })
            }
        })
}

module.exports = (client) => {
    client.on("interactionCreate", (interaction) => {
        executeInteraction(interaction, client.commands)
    })
}
