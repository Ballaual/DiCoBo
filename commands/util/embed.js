const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Creates an embed from raw JSON input')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName('json')
				.setDescription('The raw JSON input for the embed')
				.setRequired(true)),
	category: 'util',
	async execute(interaction) {
		const jsonOption = interaction.options.getString('json');

		try {
			const embedData = JSON.parse(jsonOption);
			const embed = createEmbed(embedData);

			await interaction.reply({ content: 'Embed created successfully!', ephemeral: true });

			const channel = interaction.channel;
			await channel.send({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Failed to create the embed. Please make sure the JSON input is valid.', ephemeral: true });
		}
	},
};

function createEmbed(embedData) {
	const embed = new EmbedBuilder();

	if (embedData.url) {
		embed.setURL(embedData.url);
	}

	if (embedData.fields) {
		embedData.fields.forEach(field => {
			const { name, value, inline } = field;
			embed.addFields({ name, value, inline });
		});
	}

	if (embedData.timestamp) {
		embed.setTimestamp(new Date(embedData.timestamp));
	}

	if (embedData.title) {
		embed.setTitle(embedData.title);
	}

	if (embedData.titleURL) {
		embed.setURL(embedData.titleURL);
	}

	if (embedData.description) {
		embed.setDescription(embedData.description);
	}

	if (embedData.thumbnail && embedData.thumbnail.url) {
		embed.setThumbnail(embedData.thumbnail.url);
	}

	if (embedData.image && embedData.image.url) {
		embed.setImage(embedData.image.url);
	}

	if (embedData.color) {
		embed.setColor(embedData.color);
	}

	if (embedData.footer && (embedData.footer.text || embedData.footer.icon_url)) {
		const { text, icon_url } = embedData.footer;
		embed.setFooter(text, icon_url);
	}

	return embed;
}
