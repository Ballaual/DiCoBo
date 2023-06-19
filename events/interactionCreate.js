const { Events, Collection } = require('discord.js');
const { getReactionRoles } = require('../utils/reactionRoles');
const logCommand = require('../functions/commandLogger');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isCommand()) {
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
			}
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === 'reaction-roles') {
				const roles = getReactionRoles(interaction.guildId);

				const rolesToRemove = roles.filter(
					role => interaction.member.roles.cache.has(role.roleId) && !interaction.values.includes(role.roleId),
				);

				const roleIdsToRemove = rolesToRemove.map(role => role.roleId);
				await interaction.member.roles.remove(roleIdsToRemove);

				const rolesToAdd = roles.filter(
					role => !interaction.member.roles.cache.has(role.roleId) && interaction.values.includes(role.roleId),
				);

				for (const role of rolesToAdd) {
					const discordRole = interaction.guild.roles.cache.get(role.roleId);
					await interaction.member.roles.add(discordRole);
				}

				await interaction.reply({
					content: 'Your roles have been updated!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.isButton()) {
			if (interaction.customId === 'rules-button') {
				const guildId = interaction.guildId;
				const roleId = interaction.member.roles.cache.get(guildId);

				if (roleId) {
					const filePath = `../config/reactionrole/${guildId}-rules.json`;

					const reactionRolesData = require(filePath);

					const roleIdToAssign = reactionRolesData.roleId;

					const roleToAssign = interaction.guild.roles.cache.get(roleIdToAssign);
					if (roleToAssign) {
						await interaction.member.roles.add(roleToAssign);
						await interaction.reply({
							content: 'You accepted the rules!',
							ephemeral: true,
						});
					}
					else {
						await interaction.reply({
							content: 'The role to assign does not exist.',
							ephemeral: true,
						});
					}
				}
			}
		}
	},
};
