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

// const humanizeDuration = require("humanize-duration")
// const Timeout = new Set()

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

const checkUpdates = require("./handlers/checkUpdates")
checkUpdates()

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
