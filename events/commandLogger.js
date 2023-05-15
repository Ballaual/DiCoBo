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

module.exports = logCommand;