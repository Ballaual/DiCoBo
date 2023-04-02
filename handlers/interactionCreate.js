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

// TO-DO - Merge these stuff

/* client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return
        if (!interaction.guild) return
        const command = client.slash.get(interaction.commandName)
        try {
            if (command.timeout) {
                if (Timeout.has(`${interaction.user.id}${command.name}`)) {
                    return interaction.reply({ content: `You need to wait **${humanizeDuration(command.timeout, { round: true })}** to use command again`, ephemeral: true })
                }
            }
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `:x: You need \`${command.permissions}\` to use this command`, ephemeral: true })
                }
            }
            command.run(interaction, client)
            Timeout.add(`${interaction.user.id}${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}${command.name}`)
            }, command.timeout)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: ":x: There was an error while executing this command!", ephemeral: true })
        }
    }
}); */
