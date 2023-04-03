console.log("\x1b[33m%s\x1b[0m", "Welcome to DiCoBo | https://github.com/ballaual/DiCoBo")

const discordClient = require("./discordClient")
const distubeClient = require("./distubeClient");

const registerSlashCommands = require("./handlers/registerSlashCommands")
registerSlashCommands(discordClient)

const interactionCreate = require("./handlers/interactionCreate.js")
interactionCreate(discordClient)

const ready = require("./handlers/ready")
ready(discordClient)

const errors = require("./handlers/errors")
errors(discordClient)

const messageCreate = require("./handlers/messageCreate")
messageCreate(discordClient)

const guildCreate = require("./handlers/guildCreate")
guildCreate(discordClient)

const guildDelete = require("./handlers/guildDelete")
guildDelete(discordClient)

const checkUpdates = require("./handlers/checkUpdates")
checkUpdates()