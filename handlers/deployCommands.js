const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config/config.json');
const fs = require('node:fs');
const path = require('node:path');

async function deployCommands() {
	const commands = [];

	const foldersPath = path.join(__dirname, '..', 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {

		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
				console.log('\x1b[36m%s\x1b[0m', '|Loaded|', command.data.name);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	const rest = new REST().setToken(token);

	try {
		console.log('\x1b[31m%s\x1b[0m', `Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('\x1b[31m%s\x1b[0m', `Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
}

module.exports = deployCommands;