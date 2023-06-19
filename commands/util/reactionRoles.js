const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const reactionRolesFolderPath = './config/reactionrole/';

function updateReactionRoles(guildId, roles) {
	const reactionRolesFilePath = path.join(reactionRolesFolderPath, `${guildId}-roles.json`);
	const reactionRoles = {
		GuildID: guildId,
		roles: roles,
	};

	fs.writeFileSync(reactionRolesFilePath, JSON.stringify(reactionRoles));
}

function getReactionRoles(guildId) {
	const reactionRolesFilePath = path.join(reactionRolesFolderPath, `${guildId}-roles.json`);

	if (fs.existsSync(reactionRolesFilePath)) {
		const reactionRoles = fs.readFileSync(reactionRolesFilePath, 'utf8');
		const reactionRolesObj = JSON.parse(reactionRoles);

		if (reactionRolesObj.GuildID === guildId) {
			return reactionRolesObj.roles;
		}
	}

	return [];
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionsroles')
		.setDescription('Manages reaction roles')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a reaction role to the config')
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('The role to be assigned')
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('description')
						.setDescription('The description of the role')
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('emoji')
						.setDescription('The Emoji for the role')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes a reaction role from the config')
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('The role to be removed')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('deploy')
				.setDescription('Deploys the reaction roles select menu'),
		),
	async execute(interaction) {
		const { options, guildId, guild, channel } = interaction;
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'add') {
			const role = options.getRole('role');
			const description = options.getString('description');
			const emoji = options.getString('emoji');

			try {
				const roles = getReactionRoles(guildId);

				const existingRoleIndex = roles.findIndex(existingRole => existingRole.roleId === role.id);

				if (existingRoleIndex !== -1) {

					const existingRole = roles[existingRoleIndex];
					existingRole.roleDescription = description || 'No description.';
					existingRole.roleEmoji = emoji || '';
				}
				else {

					const newRole = {
						roleId: role.id,
						roleDescription: description || 'No description.',
						roleEmoji: emoji || '',
					};
					roles.push(newRole);
				}

				updateReactionRoles(guildId, roles);
				return interaction.reply({ content: `Added role **${role.name}** to the config`, ephemeral: true });
			}
			catch (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred while adding the role to the config', ephemeral: true });
			}
		}
		else if (subcommand === 'remove') {
			const role = options.getRole('role');

			try {
				const roles = getReactionRoles(guildId);

				const removedRoleIndex = roles.findIndex(existingRole => existingRole.roleId === role.id);

				if (removedRoleIndex !== -1) {
					roles.splice(removedRoleIndex, 1);
					updateReactionRoles(guildId, roles);
					return interaction.reply({ content: `Removed role **${role.name}** from the config`, ephemeral: true });
				}
				else {
					return interaction.reply({ content: `The role **${role.name}** is not assigned in the config`, ephemeral: true });
				}
			}
			catch (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred while removing the role from the config', ephemeral: true });
			}
		}
		else if (subcommand === 'deploy') {
			try {
				const roles = getReactionRoles(guildId);

				if (roles.length === 0) {
					return interaction.reply({ content: 'There are no reaction roles defined yet.', ephemeral: true });
				}

				const panelEmbed = new EmbedBuilder().setColor('#235ee7');

				const selectMenuOptions = roles.map((x) => {
					const role = guild.roles.cache.get(x.roleId);

					return {
						label: role.name,
						value: role.id,
						description: x.roleDescription,
						emoji: x.roleEmoji || undefined,
					};
				});

				const selectMenuComponent = new StringSelectMenuBuilder()
					.setCustomId('reaction-roles')
					.setMaxValues(selectMenuOptions.length)
					.setPlaceholder('Select your desired server role')
					.addOptions(selectMenuOptions);

				const actionRowComponent = new ActionRowBuilder().addComponents(selectMenuComponent);

				panelEmbed.setDescription(generateRoleDescription(guild, roles));

				channel.send({ embeds: [panelEmbed], components: [actionRowComponent] });

				return interaction.reply({ content: 'Successfully sent your panel.', ephemeral: true });
			}
			catch (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred while sending the panel.', ephemeral: true });
			}
		}

		return interaction.reply({ content: 'Invalid subcommand.', ephemeral: true });
	},
};

function generateRoleDescription(guild, roles) {
	let description = 'Select your desired roles to update your server roles!\n\n';

	for (const role of roles) {
		const roleObj = guild.roles.cache.get(role.roleId);
		description += `${role.roleEmoji} - ${roleObj.name}\n`;
	}

	return description;
}
