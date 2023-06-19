const fs = require('fs');
const path = require('path');

const reactionRolesFolderPath = './config/reactionrole/';

function getReactionRoles(guildId) {
	const reactionRolesFilePath = path.join(reactionRolesFolderPath, `${guildId}.json`);

	if (fs.existsSync(reactionRolesFilePath)) {
		const reactionRoles = fs.readFileSync(reactionRolesFilePath, 'utf8');
		const reactionRolesObj = JSON.parse(reactionRoles);

		if (reactionRolesObj.GuildID === guildId) {
			return reactionRolesObj.roles;
		}
	}

	return [];
}

module.exports = { getReactionRoles };
