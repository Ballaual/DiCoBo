const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, version } = require("discord.js")
const os = require("os")
const botver = require("../../version.json").version

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Send detailed info about the client"),
    async execute (interaction) {
        const client = interaction.client
        const embed = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("Bot Stats")
            .setColor("#7200FF")
            .addFields(
                {
                    name: "<:author:879515584767873024> Author",
                    value: `${client.users.cache.get(process.env.Admin)?.tag}`,
                    inline: true
                },
                {
                    name: "<:server:879374547864936448> Servers",
                    value: `Serving ${client.guilds.cache.size} servers.`,
                    inline: true
                },
                {
                    name: "<:channels:879515584407162982> Channels",
                    value: `Serving ${client.channels.cache.size} channels.`,
                    inline: true
                },
                {
                    name: "<:user:879371469048664115> Users",
                    value: `Serving ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users.`,
                    inline: true
                },
                {
                    name: "<:join:879517590454689852> Join Date",
                    value: client.user.createdAt.toLocaleDateString("en-us"),
                    inline: true
                },
                {
                    name: "<:djs:879371469094805564> Discord.js Version",
                    value: `${version}`,
                    inline: true
                },
                {
                    name: "<:node:879371469015097374> Node.js Version",
                    value: `${process.version}`,
                    inline: true
                },
                {
                    name: "<:github:882479353185833020> Bot Version",
                    value: `v${botver}`,
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
                    name: "<:memory:879371468876701786> Memory",
                    value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`,
                    inline: true
                },
                {
                    name: "<:cpu:879371469052846110> CPU",
                    value: `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``,
                    inline: true
                }
            )
        await interaction.reply({ embeds: [embed] })
    }
}
