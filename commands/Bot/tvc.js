const { SlashCommandBuilder } = require('@discordjs/builders');
const tempVoice = require('../../handlers/tempVoice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tvc')
    .setDescription('Set up a trigger channel for temporary voice channels.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to use as the trigger channel.')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('category')
        .setDescription('The category to use for the temporary voice channels.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name for the temporary voice channels.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await tempVoice(interaction);
  },
};
