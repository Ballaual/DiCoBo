const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears messages")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Number of messages to clear")
                .setRequired(true)
        ),
    async execute (interaction) {
        const amount = interaction.options.getInteger("amount")
        if (amount <= 0 || amount > 100) {
            await interaction.reply({
                content: "You must provide a number between 1 and 100.",
                ephemeral: true
            })
            return
        }
        try {
            await interaction.channel.bulkDelete(amount, true)
            await interaction.reply({
                content: `Successfully deleted ${amount} messages.`,
                ephemeral: true
            })
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: "There was an error while deleting messages.",
                ephemeral: true
            })
        }
    }
}
