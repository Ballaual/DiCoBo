const ready = (client) => {
    const updateActivity = () => {
        if (client && client.guilds.cache.size > 0) {
            const activities = [
                { name: "/help" },
                { name: `on ${client.guilds.cache.size} servers` },
                { name: `with ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users` }
                // add more activities as needed
            ]

            console.log("\x1b[34m%s\x1b[0m", "Logging into Bot User...")
            console.log("\x1b[34m%s\x1b[0m", `Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers!`)

            let currentActivityIndex = 0

            client.user.setPresence({
                activities: [activities[currentActivityIndex]],
                type: "LISTENING",
                status: "online"
            })

            setInterval(() => {
                currentActivityIndex = (currentActivityIndex + 1) % activities.length
                client.user.setPresence({
                    activities: [activities[currentActivityIndex]],
                    type: "LISTENING",
                    status: "online"
                })
            }, 15000)
        }
    }

    client.on("ready", () => {
        updateActivity()
    })

    client.on("guildMemberAdd", () => {
        updateActivity()
    })

    client.on("guildMemberRemove", () => {
        updateActivity()
    })
}

module.exports = ready
