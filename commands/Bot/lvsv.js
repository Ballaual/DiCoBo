const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lvsv")
        .setDescription("leaveserver | Bot owner only!")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("id server")
                .setRequired(true)),
    async execute (interaction) {
        const guildId = interaction.options.getString("id")
        const guild = interaction.client.guilds.cache.get(guildId)

        if (interaction.member.id !== process.env.adminID) {
            return interaction.reply({ content: "Bot owner only!" })
        }

        if (!guild) {
            return interaction.reply({ content: "No guild ID was specified. Please specify a guild ID" })
        }

        try {
            await guild.leave()
            return interaction.reply({ content: `Left **${guild.name}** with \`${guild.memberCount}\` members.` })
        } catch (err) {
            return interaction.reply({ content: `An error occurred while leaving the server: \`${err.message}\`` })
        }
    }
}
