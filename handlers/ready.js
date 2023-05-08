const ready = (client) => {

let serverCount = 0

    const updateActivity = () => {
        if (client && client.guilds.cache.size > 0) {

            const activities = [
                { name: "/help" },
            ]

            console.log("\x1b[34m%s\x1b[0m", "Logging into Bot User...")
            console.log("\x1b[34m%s\x1b[0m", `Logged in as ${client.user.tag} on ${serverCount} servers!`)

            let currentActivityIndex = 0

            client.user.setPresence({
                activities: [activities[currentActivityIndex]],
                type: "ONLINE",
                status: "online"
            })

        }
    }

    client.on("ready", () => {
        updateActivity()
    })
}

module.exports = ready
