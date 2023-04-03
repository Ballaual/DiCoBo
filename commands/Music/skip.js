const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const distube = require("../../distubeClient");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song in the queue"),
    async execute(interaction) {
        const queue = await distube.getQueue(interaction);
        const voiceChannelId = interaction.member.voice.channelId;

        if (!voiceChannelId) {
            return interaction.reply({
                content: "Please join a voice channel first!",
                ephemeral: true
            });
        }

        const botMember = interaction.guild.members.cache.get(
            interaction.client.user.id
        );

        if (!botMember.voice?.channelId) {
            return interaction.reply({
                content: "I am not currently in a voice channel!",
                ephemeral: true
            });
        }

        const botVoiceChannelId = botMember.voice.channelId;

        if (voiceChannelId !== botVoiceChannelId) {
            return interaction.reply({
                content: "You need to be in the same voice channel as the bot to use this command!",
                ephemeral: true
            });
        }

        if (!queue) {
            const queueError = new EmbedBuilder()
                .setDescription("There is currently nothing to skip!")
                .setColor("#FF0000");
            return interaction.reply({ embeds: [queueError], ephemeral: true });
        }

        try {
            await distube.skip(interaction);
            await interaction.reply("⏩ | ***Skipped***");
        } catch {
            interaction.reply({ content: "There is no up next song", ephemeral: true });
        }
    },
};
