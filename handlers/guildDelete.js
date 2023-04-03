const { EmbedBuilder } = require("discord.js")

const guildDelete = (client) => {
    client.on("guildDelete", guild => {
        const embed = new EmbedBuilder()
            .setTitle("I left a server")
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`I left ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
            .setTimestamp()
        const logchannel = client.channels.cache.get(process.env.logChannel)
        logchannel.send({ embeds: [embed] })
    })
}

module.exports = guildDelete
