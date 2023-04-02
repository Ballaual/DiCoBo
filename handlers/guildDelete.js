const guildDelete = (client) => {

client.on("guildDelete", guild => {
    const embed = new EmbedBuilder()
        .setTitle("I'm left a new server")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I'm left to ${guild.name} | ID ${guild.id}\n Server member: ${guild.memberCount}\nTotal server: ${client.guilds.cache.size}`)
        .setTimestamp()
    const logchannel = client.channels.cache.get(process.env.logChannel)
    logchannel.send({ embeds: [embed] })
})
};

module.exports = guildDelete;