const { EmbedBuilder } = require("discord.js")

const guildCreate = (client) => {
    client.on("guildCreate", guild => {
        const embed = new EmbedBuilder()
            .setTitle("I'm added to a new server")
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`I'm added to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
            .setTimestamp()
        const logchannel = client.channels.cache.get(process.env.logChannel)
        logchannel.send({ embeds: [embed] })
    })
}

module.exports = guildCreate
