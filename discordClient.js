require("dotenv").config()
const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.login(process.env.token)
process.on("SIGINT", () => {
    console.log("\x1b[36m%s\x1b[0m", "SIGINT detected, exiting...")
    process.exit(0)
})

module.exports = client
