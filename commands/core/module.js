const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { enableModule, disableModule } = require('../../events/moduleManager');

function getModuleOptions() {
  const commandsPath = path.join(__dirname, '..', '..', 'commands');
  const commandFolders = fs.readdirSync(commandsPath);

  const moduleOptions = commandFolders
    .filter(folder => folder !== 'core')
    .map(folder => ({
      name: folder.charAt(0).toUpperCase() + folder.slice(1),
      value: folder.toLowerCase()
    }));

  return moduleOptions;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('module')
    .setDescription('Aktiviert oder deaktiviert ein Modul.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Aktiviert ein Modul für die aktuelle Guild.')
        .addStringOption(option =>
          option
            .setName('module')
            .setDescription('Das zu aktivierende Modul.')
            .setRequired(true)
            .addChoices(...getModuleOptions())
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Deaktiviert ein Modul für die aktuelle Guild.')
        .addStringOption(option =>
          option
            .setName('module')
            .setDescription('Das zu deaktivierende Modul.')
            .setRequired(true)
            .addChoices(...getModuleOptions())
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const moduleName = interaction.options.getString('module');

    const guildId = interaction.guildId;

    if (subcommand === 'add') {
      enableModule(guildId, moduleName);
      await interaction.reply(`Modul ${moduleName} wurde aktiviert.`);
    } else if (subcommand === 'remove') {
      disableModule(guildId, moduleName);
      await interaction.reply(`Modul ${moduleName} wurde deaktiviert.`);
    }
  },
};
