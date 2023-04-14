const { TempChannelsManager } = require("@hunteroi/discord-temp-channels")
const client = require("../discordClient")
const sqlite3 = require("sqlite3")
const fs = require("fs")
const path = require("path")

function getGuildDatabasePath (guildId) {
    return path.join("./database", `${guildId}.db`)
}

function loadTempChannels () {
    const manager = new TempChannelsManager(client)

    // Load channels from database directory
    const databaseDir = "./database"
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir)
    }
    const databaseFiles = fs.readdirSync(databaseDir)
    databaseFiles.forEach(databaseFile => {
        const guildId = databaseFile.replace(".db", "")
        const guildDatabasePath = getGuildDatabasePath(guildId)
        const db = new sqlite3.Database(guildDatabasePath)
        db.all("SELECT * FROM channels", (error, rows) => {
            if (error) {
                console.error(`Error loading channels from database for guild ${guildId}: ${error}`)
                return
            }

            rows.forEach(row => {
                const options = JSON.parse(row.options)
                // Convert childVoiceFormat string to function using eval()
                // eslint-disable-next-line no-eval
                options.childVoiceFormat = eval("(" + options.childVoiceFormat + ")")
                manager.registerChannel(row.id, options)
            })
        })
    })
}

module.exports = loadTempChannels
