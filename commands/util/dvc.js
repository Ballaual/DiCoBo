const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChannelTypes } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dvc')
    .setDescription('Definiere einen Creator-Channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Fügt einen Creator-Channel hinzu')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Der Channel, der als Creator-Channel festgelegt werden soll')
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName('category')
            .setDescription('Die Kategorie, in der der Creator-Channel erstellt werden soll')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Entfernt einen Creator-Channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Der zu entfernende Creator-Channel')
            .setRequired(true)
        )
    ),
  category: "util",
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === 'add') {
        const channelId = interaction.options.getChannel('channel').id;
        const categoryId = interaction.options.getChannel('category').id;

        const data = JSON.parse(fs.readFileSync('./database/dvc.json', 'utf8'));

        if (data.creatorChannels && data.creatorChannels.includes(channelId)) {
          return await interaction.reply('Dieser Channel ist bereits als Creator-Channel festgelegt.');
        }

        if (!data.creatorChannels) {
          data.creatorChannels = [];
        }
        data.creatorChannels.push(channelId);

        data.categories = data.categories || {};
        data.categories[channelId] = categoryId;

        fs.writeFileSync('./database/dvc.json', JSON.stringify(data));

        await interaction.reply(`Creator-Channel erfolgreich auf ${channelId} in der Kategorie ${categoryId} gesetzt.`);
      } else if (subcommand === 'remove') {
        const channelId = interaction.options.getChannel('channel').id;

        const data = JSON.parse(fs.readFileSync('./database/dvc.json', 'utf8'));

        if (!data.creatorChannels || !data.creatorChannels.includes(channelId)) {
          return await interaction.reply('Der angegebene Channel ist nicht als Creator-Channel festgelegt.');
        }

        data.creatorChannels = data.creatorChannels.filter(id => id !== channelId);

        if (data.categories && data.categories[channelId]) {
          delete data.categories[channelId];
        }

        fs.writeFileSync('./database/dvc.json', JSON.stringify(data));

        const guild = interaction.guild;
        const channel = guild.channels.cache.get(channelId);
        if (channel) {
          channel.delete();
        }

        await interaction.reply('Creator-Channel erfolgreich entfernt.');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Ein Fehler ist aufgetreten.');
    }
  },
};
