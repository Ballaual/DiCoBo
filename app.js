require("dotenv").config()
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
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
    ],
    ws: { properties: { $browser: "Discord iOS" } }
})

console.log("\x1b[33m%s\x1b[0m", "Welcome to DiCoBo | https://github.com/ballaual/DiCoBo")

const moment = require("moment")
// const humanizeDuration = require("humanize-duration")
// const Timeout = new Set()
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const fs = require("fs")
const path = require("path")
const { Collection } = require("discord.js")
const commands = new Collection()
const commandsPath = path.join(__dirname, "./", "commands")

const findCommandFiles = (dir) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const filePath = path.join(dir, file)
        if (fs.lstatSync(filePath).isDirectory()) {
            findCommandFiles(filePath)
        } else if (file.endsWith(".js")) {
            const command = require(filePath)
            if (command.data && command.data.name) {
                commands.set(command.data.name, command)
            }
        }
    }
}

findCommandFiles(commandsPath)

client.commands = commands

const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
    try {
        console.log("\x1b[31m%s\x1b[0m", `Started refreshing ${client.commands.size} application (/) commands.`)
        const data = await rest.put(
            Routes.applicationCommands(process.env.botID),
            { body: client.commands.map((command) => command.data.toJSON()) }
        )
        console.log("\x1b[31m%s\x1b[0m", `Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
        console.error(error)
    }
})()

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
    }

    try {
        await command.execute(interaction, client)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true
            })
        }
    }
})

// TO-DO - Merge these stuff

/* client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
        if (!client.slash.has(interaction.commandName)) return
        if (!interaction.guild) return
        const command = client.slash.get(interaction.commandName)
        try {
            if (command.timeout) {
                if (Timeout.has(`${interaction.user.id}${command.name}`)) {
                    return interaction.reply({ content: `You need to wait **${humanizeDuration(command.timeout, { round: true })}** to use command again`, ephemeral: true })
                }
            }
            if (command.permissions) {
                if (!interaction.member.permissions.has(command.permissions)) {
                    return interaction.reply({ content: `:x: You need \`${command.permissions}\` to use this command`, ephemeral: true })
                }
            }
            command.run(interaction, client)
            Timeout.add(`${interaction.user.id}${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}${command.name}`)
            }, command.timeout)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: ":x: There was an error while executing this command!", ephemeral: true })
        }
    }
}); */

client.on("ready", async (interaction) => {
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

client.on("error", (error) => {
    console.error("Client error:", error)
})

client.on("messageCreate", async (message) => {
    if (message.attachments.first() !== undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`)
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() !== undefined && message.content === "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an attachment in ${message.channel.id}: ${message.attachments.first().url}`)
    } else if (message.attachments.first() === undefined && message.content !== "") {
        console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) messaged in ${message.channel.id}: ${message.content}`)
    } else {
        if (message.embeds.length !== 0) {
            const a = message.embeds[0]
            const embed = {}
            for (const b in a) {
                if (a[b] != null && (a[b] !== [] && a[b].length !== 0) && a[b] !== {}) {
                    embed[b] = a[b]
                }
            }
            console.log("\x1b[32m%s\x1b[0m", `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message.author.username} (${message.author.id}) sent an embed in ${message.channel.id}: ${JSON.stringify(embed, null, 2)}`)
        }
    }
})

client.on("guildCreate", guild => {
    const embed = new EmbedBuilder()
        .setTitle("I'm added to a new server")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I'm added to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
        .setTimestamp()
    const logchannel = client.channels.cache.get(process.env.logChannel)
    logchannel.send({ embeds: [embed] })
})

client.on("guildDelete", guild => {
    const embed = new EmbedBuilder()
        .setTitle("I'm left a new server")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I'm left to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
        .setTimestamp()
    const logchannel = client.channels.cache.get(process.env.logChannel)
    logchannel.send({ embeds: [embed] })
})

// Distube client
const Distube = require("distube")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { SpotifyPlugin } = require("@distube/spotify")
const { YtDlpPlugin } = require("@distube/yt-dlp")
// eslint-disable-next-line new-cap
client.distube = new Distube.default(client, {
    leaveOnEmpty: true,
    emptyCooldown: 30,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    nsfw: true,
    youtubeCookie: process.env.ytcookie,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin(), new YtDlpPlugin()]
})
const status = (queue) => {
    const filterText = Array.isArray(queue.filters) ? queue.filters.join(", ") : "Off"
    return `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\` | Filter: \`${filterText}\``
}

// DisTube event listeners
client.distube
    .on("playSong", (queue, song) => {
        const embed = new EmbedBuilder()
            .setColor("#7200FF")
            .setAuthor({ name: "Started Playing", iconURL: "https://raw.githubusercontent.com/ballaual/DiCoBo/master/assets/music.gif" })
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .addFields(
                { name: "**Views:**", value: song.views.toString(), inline: true },
                { name: "**Likes:**", value: song.likes.toString(), inline: true },
                { name: "**Duration:**", value: song.formattedDuration.toString(), inline: true },
                { name: "**Status**", value: status(queue).toString() })
            .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("addSong", (queue, song) => {
        const embed = new EmbedBuilder()
            .setTitle(":ballot_box_with_check: | Added song to queue")
            .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` - Requested by ${song.user}`)
            .setColor("#7200FF")
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("addList", (queue, playlist) => {
        const embed = new EmbedBuilder()
            .setTitle(":ballot_box_with_check: | Add list")
            .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`)
            .setColor("#7200FF")
            .setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("error", (textChannel, e) => {
        console.error(e)
        textChannel.send(`An error encountered: ${e}`)
    })

    .on("finishSong", queue => {
        const embed = new EmbedBuilder()
            .setDescription(`:white_check_mark: | Finished playing \`${queue.songs[0].name}\``)
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("disconnect", queue => {
        const embed = new EmbedBuilder()
            .setDescription(":x: | Disconnected from voice channel")
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("empty", queue => {
        const embed = new EmbedBuilder()
            .setDescription(":x: | Channel is empty. Leaving the channel!")
        queue.textChannel.send({ embeds: [embed] })
    })

    .on("initQueue", (queue) => {
        queue.autoplay = false
        queue.volume = 50
    })

client.login(process.env.token)
process.on("SIGINT", () => {
    console.log("\x1b[36m%s\x1b[0m", "SIGINT detected, exiting...")
    process.exit(0)
})

// Check repo for available updates
import("node-fetch")
    .then((mod) => {
        const fetch = mod.default
        const { version } = require("./version.json")
        console.log("\x1b[33m%s\x1b[0m", `Current version : ${version}`)
        fetch("https://raw.githubusercontent.com/ballaual/DiCoBo/master/version.json")
            .then((res) => res.json())
            .then((data) => {
                if (data.version !== version) {
                    console.log("\x1b[32m%s\x1b[0m", "===============================Update Available===================================")
                    console.log("Version:", data.version)
                    console.log("\x1b[36m%s\x1b[0m", "Check commit : https://github.com/ballaual/DiCoBo/commits/master")
                    console.log("\x1b[31m%s\x1b[0m", "Use `npm run update` to update")
                    console.log("\x1b[32m%s\x1b[0m", "==================================================================================")
                } else {
                    console.log("\x1b[32m%s\x1b[0m", "No Update Available")
                }
            })
            .catch((err) => {
                console.log("\x1b[31m%s\x1b[0m", err)
            })
    })
    .catch((err) => {
        console.log("\x1b[31m%s\x1b[0m", err)
    })
