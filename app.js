console.log("\x1b[33m%s\x1b[0m", "Welcome to DiCoBo | https://github.com/ballaual/DiCoBo")

const client = require("./discordClient")

const registerSlashCommands = require("./handlers/registerSlashCommands")
registerSlashCommands(client)

const interactionCreate = require("./handlers/interactionCreate.js")
interactionCreate(client)

const ready = require("./handlers/ready")
ready(client)

const errors = require("./handlers/errors")
errors(client)

const messageCreate = require("./handlers/messageCreate")
messageCreate(client)

const guildCreate = require("./handlers/guildCreate")
guildCreate(client)

const guildDelete = require("./handlers/guildDelete")
guildDelete(client)

const loadTempChannels = require("./handlers/loadTempChannels")
loadTempChannels()

const checkUpdates = require("./handlers/checkUpdates")
checkUpdates()
