const { TempChannelsManager } = require("@hunteroi/discord-temp-channels")
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
        .setName("registerchannel")
        .setDescription("Registers a trigger channel for temporary voice channels")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the new channel")
                .setRequired(true)
                .setMaxLength(20)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The ID of trigger channel")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("category")
                .setDescription("The ID of the category where the temporary channels will be created in")
                .setRequired(true)
        ),
    async execute (interaction) {
        const name = interaction.options.getString("name")
        const channelId = interaction.options.getChannel("channel").id
        const categoryId = interaction.options.getChannel("category").id

        // Fetch channel information
        const channel = await interaction.client.channels.fetch(channelId)

        // Get maxUsers and bitrate from the channel
        const maxUsers = channel.userLimit
        const bitrate = channel.bitrate

        const options = {
            childCategory: categoryId,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfParentGetsUnregistered: true,
            childAutoDeleteIfOwnerLeaves: false,
            childVoiceFormat: `(str, count) => \`${name} #\${count}\``,
            childVoiceFormatRegex: /^Example #\d+ \|/,
            childMaxUsers: maxUsers,
            childBitrate: bitrate
        }

        const optionsJson = JSON.stringify(options)

        const guildDatabasePath = getGuildDatabasePath(interaction.guildId)
        const db = new sqlite3.Database(guildDatabasePath)

        db.run("CREATE TABLE IF NOT EXISTS channels (id TEXT PRIMARY KEY NOT NULL, options TEXT NOT NULL)", error => {
            if (error) {
                console.error(`Error creating channels table for guild ${interaction.guildId}: ${error}`)
                return
            }

            db.run("INSERT INTO channels (id, options) VALUES (?, ?)", [channelId, optionsJson], async error => {
                if (error) {
                    console.error(`Error registering channel in database: ${error}`)
                    await interaction.reply({ content: "An error occurred while registering the channel", ephemeral: true })
                    return
                }
                const manager = new TempChannelsManager(interaction.client)

                // Load channels from database
                db.all("SELECT * FROM channels", (error, rows) => {
                    if (error) {
                        console.error(`Error loading channels from database for guild ${interaction.guildId}: ${error}`)
                        return
                    }

                    rows.forEach(row => {
                        const options = JSON.parse(row.options)
                        // Convert childVoiceFormat string to function using eval()
                        // eslint-disable-next-line no-eval
                        options.childVoiceFormat = eval("(" + options.childVoiceFormat + ")")
                        // Convert childVoiceFormat string to function
                        // eslint-disable-next-line no-new-func
                        options.childVoiceFormat = Function(`return ${options.childVoiceFormat}`)()
                        options.childVoiceFormatRegex = /^Example #\d+ \|/

                        manager.registerChannel(row.id, options)
                    })
                })

                await interaction.reply({ content: `Channel ${channelId} registered successfully as trigger channel for temporary voice channels`, ephemeral: true })
            })
        })
    }
}
