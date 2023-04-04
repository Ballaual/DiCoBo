const fs = require("fs")
const path = require("path")

function loadListener (client) {
    client.guilds.cache.forEach(guild => {
        const guildID = guild.id
        const dataFilePath = path.join(__dirname, "..", "configs", "voice", `${guildID}.json`)
        let data

        try {
            data = JSON.parse(fs.readFileSync(dataFilePath))
        } catch (err) {
            // Create the configs folder and the guild-specific JSON file if they don"t exist
            fs.mkdirSync(path.join(__dirname, "..", "configs", "voice"), { recursive: true })
            fs.writeFileSync(dataFilePath, JSON.stringify({}))
            data = {}
        }

        // Set up the listener for each trigger channel
        for (const [triggerChannelID, triggerChannelData] of Object.entries(data)) {
            const triggerChannel = guild.channels.cache.get(triggerChannelID)

            if (!triggerChannel) {
                console.error(`Trigger channel not found: ${triggerChannelID}`)
                continue
            }

            const { name, category } = triggerChannelData
            const channelName = name

            const listener = async (oldState, newState) => {
                // Check if a user joined the trigger channel
                if (!oldState.channelId && newState.channelId === triggerChannel.id) {
                    // Create a new temporary voice channel in the specified category
                    const newChannel = await triggerChannel.guild.channels.create({
                        name: channelName,
                        type: 2,
                        parent: category
                        // your permission overwrites or other options here
                    })

                    // Move the user to the new temporary voice channel
                    await newState.member.voice.setChannel(newChannel)

                    // Add the new temporary channel to the data object
                    data[triggerChannel.id] = {
                        ...data[triggerChannel.id],
                        createdChannels: {
                            ...data[triggerChannel.id].createdChannels,
                            [newChannel.id]: {
                                name: channelName,
                                category: category.id,
                                owner: newState.member.id
                            }
                        }
                    }
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))

                    // Add the onLeave listener to the client
                    const onLeave = async (oldState, newState) => {
                        if (oldState.channelId === newChannel.id && newChannel.members.size === 0) {
                            // Delete the temporary channel when it becomes empty
                            await newChannel.delete()

                            // Remove the temporary channel data from the data object
                            delete data[triggerChannel.id].createdChannels[newChannel.id]
                            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))

                            // Remove the onLeave listener from the client
                            client.off("voiceStateUpdate", onLeave)
                        }
                    }

                    // Add the onLeave listener to the client
                    client.on("voiceStateUpdate", onLeave)
                }
            }

            client.on("voiceStateUpdate", listener)
        }
    })
}

module.exports = loadListener
