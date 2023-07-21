const { Events, Collection, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const logCommand = require('../functions/commandLogger');
const lockCommand = require('../commands/dvc/lock');
const unlockCommand = require('../commands/dvc/unlock');

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
				const guildId = interaction.guildId;
				const roleId = interaction.member.roles.cache.get(guildId);

				if (roleId) {
					const filePath = `../config/reactionrole/${guildId}-roles.json`;

					try {
						const reactionRolesData = require(filePath);
						const roles = reactionRolesData.roles;

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

						const addedRoles = rolesToAdd.map(role => interaction.guild.roles.cache.get(role.roleId));
						const removedRoles = rolesToRemove.map(role => interaction.guild.roles.cache.get(role.roleId));

						const embed = new EmbedBuilder()
							.setTitle('Role Update')
							.setDescription('Your roles have been updated!')
							.setColor('#7200FF')
							.addFields(
								{ name: 'Added Roles', value: addedRoles.map(role => role.name).join('\n') || 'None' },
								{ name: 'Removed Roles', value: removedRoles.map(role => role.name).join('\n') || 'None' },
							)
							.setTimestamp();

						await interaction.user.send({ embeds: [embed] });

						await interaction.reply({
							content: 'You updated your server roles! Check your DMs for more information.',
							ephemeral: true,
						});
					}
					catch (error) {
						console.error(`Error reading reaction role data for guild ${guildId}`);
						console.error(error);
						await interaction.reply({
							content: 'An error occurred while processing the reaction roles.',
							ephemeral: true,
						});
					}
				}
			}
		}
		else if (interaction.isButton()) {
			if (interaction.customId === 'vcLock') {
				await lockCommand.execute(interaction);
			}
			else if (interaction.customId === 'vcUnlock') {
				await unlockCommand.execute(interaction);
			}
			else if (interaction.customId === 'vcRename') {
				const vcRenameModal = new ModalBuilder()
					.setCustomId('vcRenameModal')
					.setTitle('Update your channel name');

				const vcRenameInput = new TextInputBuilder()
					.setCustomId('vcRenameInput')
					.setLabel('Insert your new channel name and hit submit')
					.setMaxLength(15)
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const vcRenameActionRow = new ActionRowBuilder().addComponents(vcRenameInput);
				vcRenameModal.addComponents(vcRenameActionRow);
				await interaction.showModal(vcRenameModal);
			}
			else if (interaction.customId === 'vcBlock') {
				// Logic for the vcBlock button
			}
			else if (interaction.customId === 'vcPermit') {
				// Logic for the vcPermit button
			}
			else if (interaction.customId === 'vcLimit') {
				const vcLimitModal = new ModalBuilder()
					.setCustomId('vcLimitModal')
					.setTitle('Update the user limit');

				const vcLimitInput = new TextInputBuilder()
					.setCustomId('vcLimitInput')
					.setLabel('Insert the new user limit and submit')
					.setMinLength(1)
					.setMaxLength(2)
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const vcLimitActionRow = new ActionRowBuilder().addComponents(vcLimitInput);
				vcLimitModal.addComponents(vcLimitActionRow);
				await interaction.showModal(vcLimitModal);
			}
			else if (interaction.customId === 'vcKick') {
				// Logic for the vcKick button
			}
			else if (interaction.customId === 'rules-button') {
				const guildId = interaction.guildId;
				const roleId = interaction.member.roles.cache.get(guildId);

				if (roleId) {
					const filePath = `../config/reactionrole/${guildId}-rules.json`;

					const reactionRolesData = require(filePath);

					const roleIdToAssign = reactionRolesData.roleId;

					const roleToAssign = interaction.guild.roles.cache.get(roleIdToAssign);
					if (roleToAssign) {
						await interaction.member.roles.add(roleToAssign);

						const embed = new EmbedBuilder()
							.setTitle('Role Update')
							.setDescription('You accepted the rules!')
							.setColor('#7200FF')
							.addFields({ name: 'Added Role', value: roleToAssign.name })
							.setTimestamp();

						await interaction.user.send({ embeds: [embed] });

						await interaction.reply({
							content: 'You accepted the rules! Check your DMs for more information.',
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
		else if (interaction.isModalSubmit()) {
			if (interaction.customId === 'vcRenameModal') {
				const vcRenameNewName = interaction.fields.getTextInputValue('vcRenameInput');
				const voiceChannel = interaction.member.voice.channel;

				if (!voiceChannel) {
					return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });
				}

				try {
					await voiceChannel.setName(vcRenameNewName);

					const guildId = interaction.guildId;
					const filePath = `./config/dvc/${guildId}.json`;
					const data = fs.readFileSync(filePath, 'utf8');
					const config = JSON.parse(data);
					config.userChannels[voiceChannel.id].channelName = vcRenameNewName;
					fs.writeFileSync(filePath, JSON.stringify(config, null, 4));

					const vcRenamedEmbed = new EmbedBuilder()
						.setTitle('Name updated!')
						.setDescription(`The name of your voice channel has been updated to \`${vcRenameNewName}\`.`)
						.setColor('#00FF00');

					return interaction.reply({ embeds: [vcRenamedEmbed], ephemeral: true });
				}
				catch (error) {
					console.error('Failed to update voice channel name:', error);
					await interaction.reply({ content: 'An error occurred while updating the voice channel name.', ephemeral: true });
				}
			}
			else if (interaction.customId === 'vcLimitModal') {
				const vcLimitNewLimit = interaction.fields.getTextInputValue('vcLimitInput');
				const voiceChannel = interaction.member.voice.channel;

				if (!voiceChannel) {
					return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });
				}

				try {
					await voiceChannel.setUserLimit(vcLimitNewLimit);
					const limit = vcLimitNewLimit === '0' ? 'unlimited' : vcLimitNewLimit.toString();

					const guildId = interaction.guildId;
					const filePath = `./config/dvc/${guildId}.json`;
					const data = fs.readFileSync(filePath, 'utf8');
					const config = JSON.parse(data);
					config.userChannels[voiceChannel.id].userLimit = parseInt(vcLimitNewLimit);
					fs.writeFileSync(filePath, JSON.stringify(config, null, 4));

					const vcRenamedEmbed = new EmbedBuilder()
						.setTitle('User Limit updated!')
						.setDescription(`The user limit of your voice channel has been updated to \`${limit}\`.`)
						.setColor('#00FF00');

					return interaction.reply({ embeds: [vcRenamedEmbed], ephemeral: true });
				}
				catch (error) {
					console.error('Failed to update user limit of the voice channel:', error);
					await interaction.reply({ content: 'An error occurred while updating the user limit of the voice channel.', ephemeral: true });
				}
			}
		}
	},
};
