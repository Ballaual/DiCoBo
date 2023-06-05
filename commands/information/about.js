const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Displays some information about a specific user')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to get information for')
				.setRequired(true))
		.setDMPermission(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		const embed = new EmbedBuilder()
			.setTitle(user.username)
			.setColor('#D722F3')
			.setURL(`https://discord.com/users/${user.id}`)
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: 'User ID', value: user.id, inline: true },
				{ name: 'User Tag', value: user.tag, inline: true },
				{ name: 'Avatar URL', value: user.displayAvatarURL({ dynamic: true }) },
				{ name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true },
				{ name: 'Joined Server', value: interaction.guild.members.cache.get(user.id).joinedAt.toDateString(), inline: true },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
