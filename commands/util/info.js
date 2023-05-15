const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, version } = require("discord.js")
const os = require("os")
const botver = require("../../version.json").version
const { ownerId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays detailed information about the bot"),
    category: "util",
    async execute (interaction) {
        const client = interaction.client
        const embed = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("Bot Information")
            .setColor("#7200FF")
            .addFields(
                {
                    name: "<:author:1091296385388773437> Author",
                    value: `${client.users.cache.get(ownerId)?.tag}`,
                    inline: true
                },
                {
                    name: "<:discord:1091295194818818098> Servers",
                    value: `Joined ${client.guilds.cache.size} servers`,
                    inline: true
                },
                {
                    name: "<:channels:1091302046201810984> Channels",
                    value: `Watching ${client.channels.cache.size} channels`,
                    inline: true
                },
                {
                    name: "<:user:1091295188762243114> Users",
                    value: `Serving ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`,
                    inline: true
                },
                {
                    name: "<:join:1091295564483792926> Join Date",
                    value: client.user.createdAt.toLocaleDateString("en-us"),
                    inline: true
                },
                {
                    name: "<:djs:1091295192956547072> Discord.js Version",
                    value: `\`v${version}\``,
                    inline: true
                },
                {
                    name: "<:node:1091294141641674852> Node.js Version",
                    value: `\`${process.version}\``,
                    inline: true
                },
                {
                    name: "<:github:1091295909972803616> Bot Version",
                    value: `\`v${botver}\``,
                    inline: true
                },
                {
                    name: "<:computer:879379500322922507> ARCH",
                    value: `\`${os.arch()}\``,
                    inline: true
                },
                {
                    name: "<:computer:879379500322922507> Platform",
                    value: `\`${os.platform()}\``,
                    inline: true
                },
                {
                    name: "<:memory:1091301379928236074> Memory",
                    value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} mb\``,
                    inline: true
                },
                {
                    name: "<:cpu:1091295423915892737> CPU",
                    value: `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``,
                    inline: true
                }
            )
        await interaction.reply({ embeds: [embed] })
    }
}