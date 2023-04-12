const { TempChannelsManager } = require("@ballaual/discord-temp-voice")
const { SlashCommandBuilder } = require("@discordjs/builders")
const sqlite3 = require("sqlite3")
const fs = require("fs")
const path = require("path")

// Make sure the ./database directory exists
const databaseDir = "./database"
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir)
}

function getGuildDatabasePath (guildId) {
    return path.join(databaseDir, `${guildId}.db`)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unregisterchannel")
        .setDescription(
            "Unregisters a trigger channel and deletes associated temporary voice channels"
        )
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The ID of trigger channel")
                .setRequired(true)
        ),
    async execute (interaction) {
        const channelId = interaction.options.getChannel("channel").id
        const guildDatabasePath = getGuildDatabasePath(interaction.guildId)
        const db = new sqlite3.Database(guildDatabasePath)

        try {
            await new Promise((resolve, reject) => {
                db.run("DELETE FROM channels WHERE id = ?", [channelId], (error) => {
                    if (error) {
                        console.error(`Error unregistering channel from database: ${error}`)
                        reject(error)
                        return
                    }
                    resolve()
                })
            })

            const manager = new TempChannelsManager(interaction.client)

            try {
                await manager.unregisterChannel(channelId)
                console.log(`Temporary voice channels associated with channel ${channelId} unregistered successfully`)
                await interaction.reply({ content: `Channel ${channelId} unregistered successfully as trigger channel for temporary voice channels`, ephemeral: true })
            } catch (error) {
                await interaction.reply({ content: `Channel ${channelId} unregistered successfully as trigger channel for temporary voice channels`, ephemeral: true })
            }

            db.close()
        } catch (error) {
            console.error(`Error unregistering channel from database: ${error}`)
            await interaction.reply({ content: "An error occurred while unregistering the channel", ephemeral: true })
            db.close()
        }
    }
}
