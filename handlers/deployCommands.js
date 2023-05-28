const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('../config/config.json');
const fs = require('fs');
const path = require('path');

const guildModulesFolderPath = path.join(__dirname, '..', 'config', 'modules');

function createDirectoryIfNotExists(directoryPath) {
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
	}
}

function createModuleFileIfNotExists(guildId) {
	const guildModulesFilePath = path.join(guildModulesFolderPath, `${guildId}.json`);
	if (!fs.existsSync(guildModulesFilePath)) {
		fs.writeFileSync(guildModulesFilePath, '{}');
	}
}

createDirectoryIfNotExists(guildModulesFolderPath);

function loadModules(guildId) {
	const filePath = path.join(__dirname, '..', 'config', 'modules', `${guildId}.json`);

	try {
		const data = fs.readFileSync(filePath, 'utf8');

		if (data) {
			return JSON.parse(data);
		}
		else {
			console.error(`Module data for Guild ID ${guildId} is empty. Returning an empty object.`);
			return {};
		}
	}
	catch (error) {
		console.error(`Error reading module data for Guild ID ${guildId}. Returning an empty object.`, error);
		return {};
	}
}

function saveModules(guildId, modules) {
	try {
		const guildModulesFilePath = path.join(guildModulesFolderPath, `${guildId}.json`);
		fs.writeFileSync(guildModulesFilePath, JSON.stringify(modules, null, 2));
	}
	catch (error) {
		console.error('Error saving modules:', error);
	}
}

async function deployCommands() {
	const foldersPath = path.join(__dirname, '..', 'commands');
	const moduleFolders = fs.readdirSync(foldersPath);

	const rest = new REST({ version: '9' }).setToken(token);

	try {
		const globalCommands = [];

		const coreModuleFolderPath = path.join(foldersPath, 'core');
		const coreCommandFiles = fs.readdirSync(coreModuleFolderPath).filter(file => file.endsWith('.js'));

		console.log('Loading global commands...');

		for (const file of coreCommandFiles) {
			const filePath = path.join(coreModuleFolderPath, file);
			const command = require(filePath);

			if ('data' in command && 'execute' in command) {
				globalCommands.push(command.data.toJSON());
				console.log('\x1b[36m%s\x1b[0m', '|Loaded|', command.data.name);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: globalCommands },
		);

		console.log('\x1b[32m%s\x1b[0m', `Successfully deployed ${globalCommands.length} global application (/) commands.`);

		const guilds = await rest.get(Routes.userGuilds());
		const guildIds = guilds.map(guild => guild.id);

		for (const guildId of guildIds) {
			createModuleFileIfNotExists(guildId);

			const modules = loadModules(guildId);

			console.log('\x1b[31m%s\x1b[0m', `Active modules for Guild ID ${guildId}:`, Object.keys(modules).length > 0 ? Object.keys(modules).join(', ') : '---');

			const existingCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

			const commandIdsToDelete = existingCommands.map(command => command.id);

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: [] },
			);

			console.log('\x1b[33m%s\x1b[0m', `Deleted ${commandIdsToDelete.length} guild application (/) commands for Guild ID: ${guildId}.`);

			const guildCommands = [];

			for (const moduleName in modules) {
				if (moduleFolders.includes(moduleName)) {
					const moduleFolderPath = path.join(foldersPath, moduleName);
					const commandFiles = fs.readdirSync(moduleFolderPath).filter(file => file.endsWith('.js'));

					for (const file of commandFiles) {
						const filePath = path.join(moduleFolderPath, file);
						const command = require(filePath);

						if ('data' in command && 'execute' in command) {
							guildCommands.push(command.data.toJSON());
							console.log('\x1b[36m%s\x1b[0m', '|Loaded|', command.data.name);
						}
						else {
							console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
						}
					}
				}
			}

			if (guildCommands.length > 0) {
				const guildData = guildCommands.map(command => {
					return {
						name: command.name,
						description: command.description,
						options: command.options ? command.options : [],
					};
				});

				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: guildData },
				);

				saveModules(guildId, modules);

				console.log('\x1b[32m%s\x1b[0m', `Successfully deployed ${guildCommands.length} guild application (/) commands for Guild ID: ${guildId}.`);
			}
			else {
				console.log(`No guild commands to update for Guild ID: ${guildId}.`);
			}
		}
	}
	catch (error) {
		console.error(error);
	}
}

async function reloadGuildCommands(guildId) {
	const foldersPath = path.join(__dirname, '..', 'commands');
	const moduleFolders = fs.readdirSync(foldersPath);

	const rest = new REST({ version: '9' }).setToken(token);

	try {
		createModuleFileIfNotExists(guildId);

		const modules = loadModules(guildId);

		console.log('\x1b[31m%s\x1b[0m', `Active modules for Guild ID ${guildId}:`, Object.keys(modules).length > 0 ? Object.keys(modules).join(', ') : '---');

		const existingCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

		const commandIdsToDelete = existingCommands.map(command => command.id);

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [] },
		);

		console.log('\x1b[33m%s\x1b[0m', `Deleted ${commandIdsToDelete.length} guild application (/) commands for Guild ID: ${guildId}.`);

		const guildCommands = [];

		for (const moduleName in modules) {
			if (moduleFolders.includes(moduleName)) {
				const moduleFolderPath = path.join(foldersPath, moduleName);
				const commandFiles = fs.readdirSync(moduleFolderPath).filter(file => file.endsWith('.js'));

				for (const file of commandFiles) {
					const filePath = path.join(moduleFolderPath, file);
					const command = require(filePath);

					if ('data' in command && 'execute' in command) {
						guildCommands.push(command.data.toJSON());
						console.log('\x1b[36m%s\x1b[0m', '|Loaded|', command.data.name);
					}
					else {
						console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
					}
				}
			}
		}

		if (guildCommands.length > 0) {
			const guildData = guildCommands.map(command => {
				return {
					name: command.name,
					description: command.description,
					options: command.options ? command.options : [],
				};
			});

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: guildData },
			);

			saveModules(guildId, modules);

			console.log('\x1b[32m%s\x1b[0m', `Successfully deployed ${guildCommands.length} guild application (/) commands for Guild ID: ${guildId}.`);
		}
		else {
			console.log(`No guild commands to update for Guild ID: ${guildId}.`);
		}
	}
	catch (error) {
		console.error(error);
	}
}

module.exports = {
	deployCommands,
	reloadGuildCommands,
};