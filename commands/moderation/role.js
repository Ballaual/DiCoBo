const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Adds or removes a role from a user')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a role to a user')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Select the user')
						.setRequired(true))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Select the role')
						.setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes a role from a user')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Select the user')
						.setRequired(true))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Select the role')
						.setRequired(true)),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const user = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');

		if (subcommand === 'add') {
			await user.roles.add(role);
			await interaction.reply({ content: `Added \`${role.name}\` to \`${user.user.tag}\``, ephemeral: true });
		}
		else if (subcommand === 'remove') {
			await user.roles.remove(role);
			await interaction.reply({ conent: `Removed \`${role.name}\` from \`${user.user.tag}\``, ephemeral: true });
		}
	},
};
