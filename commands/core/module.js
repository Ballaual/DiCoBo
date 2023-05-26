const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const guildModulesFolderPath = path.join(__dirname, '..', '..', 'config', 'modules');
const deployCommands = require('../../handlers/deployCommands');
const { PermissionFlagsBits } = require('discord.js');

async function loadModules(guildId) {
  try {
    const guildModulesFilePath = path.join(guildModulesFolderPath, `${guildId}.json`);
    const fileExists = await fs.promises.access(guildModulesFilePath).then(() => true).catch(() => false);
    if (fileExists) {
      const data = await fs.promises.readFile(guildModulesFilePath, 'utf8');
      return JSON.parse(data);
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error loading modules:', error);
    return {};
  }
}

async function saveModules(guildId, modules) {
  try {
    const guildModulesFilePath = path.join(guildModulesFolderPath, `${guildId}.json`);
    await fs.promises.writeFile(guildModulesFilePath, JSON.stringify(modules, null, 2));
  } catch (error) {
    console.error('Error saving modules:', error);
  }
}

function getModuleChoices() {
  const commandsFolderPath = path.join(__dirname, '..', '..', 'commands');
  const moduleChoices = [];

  fs.readdirSync(commandsFolderPath).forEach(folder => {
    const moduleFolderPath = path.join(commandsFolderPath, folder);
    if (fs.statSync(moduleFolderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(moduleFolderPath).filter(file => file.endsWith('.js'));
      if (commandFiles.length > 0 && folder !== 'core') {
        moduleChoices.push({
          name: folder.charAt(0).toUpperCase() + folder.slice(1),
          value: folder,
        });
      }
    }
  });

  return moduleChoices;
}

function createGuildModules(guildId) {
  const guildModulesFilePath = path.join(guildModulesFolderPath, `${guildId}.json`);
  if (!fs.existsSync(guildModulesFolderPath)) {
    fs.mkdirSync(guildModulesFolderPath, { recursive: true });
  }
  if (!fs.existsSync(guildModulesFilePath)) {
    fs.writeFileSync(guildModulesFilePath, JSON.stringify({}, null, 2));
  }
}

module.exports = {
  cooldown: 180,
  data: new SlashCommandBuilder()
    .setName('module')
    .setDescription('Enable, disable, or show modules')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Enable a module')
        .addStringOption(option =>
          option.setName('module')
            .setDescription('Module to enable')
            .setRequired(true)
            .addChoices(...getModuleChoices())
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Disable a module')
        .addStringOption(option =>
          option.setName('module')
            .setDescription('Module to disable')
            .setRequired(true)
            .addChoices(...getModuleChoices())
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription('Show active modules for the guild')
    ),
  category: 'core',
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    const modules = loadModules(guildId);

    createGuildModules(guildId);

    if (subcommand === 'add') {
      const module = interaction.options.getString('module');

      if (module === 'core') {
        interaction.reply('The core module cannot be enabled or disabled per guild.');
        return;
      }

      modules[module] = true;
      interaction.reply({ content: `Module \`${module}\` has been enabled for this guild.`, ephemeral: true });

      saveModules(guildId, modules);
      deployCommands();
    } else if (subcommand === 'remove') {
      const module = interaction.options.getString('module');

      delete modules[module];
      interaction.reply({ content: `Module \`${module}\` has been disabled for this guild.`, ephemeral: true });

      saveModules(guildId, modules);
      deployCommands();
    } else if (subcommand === 'show') {
      const activeModules = Object.keys(modules).filter(module => module !== 'core').join(', ');

      if (activeModules) {
        interaction.reply({ content: `Active modules for this guild: \`${activeModules}\``, ephemeral: true });
      } else {
        interaction.reply({ content: 'No active modules for this guild.', ephemeral: true });
      }
    } else {
      interaction.reply('Invalid subcommand.');
    }
  },
};

