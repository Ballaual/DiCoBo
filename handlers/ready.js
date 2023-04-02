const ready = (client) => {
    client.on("ready", async (interaction) => {
        console.log("\x1b[34m%s\x1b[0m", "Logging into Bot User...")
        console.log("\x1b[34m%s\x1b[0m", `Logged in as ${client.user.tag}!`)
        const statuses = [ // status bot
            "Hentaiz",
            `with ${client.guilds.cache.size} servers`,
            `with ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`,
            "Youtube",
            "Slash command",
            "Spotify",
            "soundcloud",
            "Twitch"
        ]
        let index = 0
        setInterval(() => {
            if (index === statuses.length) index = 0
            const status = statuses[index]
            client.user.setActivity(`${status}`, {
                type: "LISTENING",
                browser: "DISCORD IOS"
            })
            index++
        }, 60000)
    })
}

module.exports = ready
