const ready = (client) => {
    let serverCount = 0
    let memberCount = 0
  
    const updateActivity = () => {
      if (client && client.guilds.cache.size > 0) {
        serverCount = client.guilds.cache.size
        memberCount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
  
        const activities = [
          { name: "/help" },
          { name: `on ${serverCount} servers` },
          { name: `with ${memberCount} users` }
          // add more activities as needed
        ]
  
        console.log("\x1b[34m%s\x1b[0m", "Logging into Bot User...")
        console.log("\x1b[34m%s\x1b[0m", `Logged in as ${client.user.tag} on ${serverCount} servers!`)
  
        let currentActivityIndex = 0
  
        client.user.setPresence({
          activities: [activities[currentActivityIndex]],
          type: "PLAYING",
          status: "online"
        })
  
        setInterval(() => {
          currentActivityIndex = (currentActivityIndex + 1) % activities.length
          client.user.setPresence({
            activities: [activities[currentActivityIndex]],
            type: "PLAYING",
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
  