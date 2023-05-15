const { Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

function logCommand(commandName, user, serverId) {
	const logMessage = `${new Date().toLocaleString()}: ${user} executed the command: ${commandName}\n`;

	const logsDir = path.join(__dirname, '..', 'logs');
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir);
	}

	const filePath = path.join(logsDir, `${serverId}.txt`);
	fs.appendFile(filePath, logMessage, (err) => {
		if (err) console.error(err);
	});
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.name ?? interaction.commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					ephemeral: true,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
			logCommand(interaction.commandName, interaction.user.tag, interaction.guild?.id);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
