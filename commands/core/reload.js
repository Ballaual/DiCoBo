const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../config/config.json');
const deployCommands = require('../../handlers/deployCommands');

module.exports = {
  cooldown: 180,
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads all commands.')
    .setDMPermission(false),
  category: 'core',
  async execute(interaction) {
    if (interaction.member.id !== ownerId) {
      return interaction.reply({
        content: 'Only the bot owner is allowed to use this command!',
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply({ ephemeral: true });
      setTimeout(async () => {
        await interaction.editReply('Reloading commands...');
        deployCommands();
        await interaction.editReply('All commands have been reloaded!');
      }, 5000);
    } catch (error) {
      console.error(error);
      await interaction.editReply(`There was an error while reloading commands:\n\`${error.message}\``);
    }
  },
};
