const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yugioh')
		.setDescription('Uploads and posts anonymously a .ydk file.')
		.setDMPermission(false)
		.addAttachmentOption((option) =>
			option
				.setName('file')
				.setDescription('Upload a .ydk file')
				.setRequired(true),
		),
	category: 'yugioh',
	async execute(interaction) {
		const file = interaction.options.getAttachment('file');

		const attachmentName = `${generateRandomName()}.ydk`;
		const originalFileName = file.name;
		const channel = interaction.channel;

		if (!originalFileName.endsWith('.ydk')) {
			return await interaction.reply({
				content: 'Invalid file format. Please upload a .ydk file.',
				ephemeral: true,
			});
		}

		await interaction.reply({
			content: `Uploading file \`${originalFileName}\`...`,
			ephemeral: true,
		});

		try {
			const fileData = await getFileData(file.attachment);
			await channel.send({
				content: 'A new anonymous deck file has been uploaded!\nVisit https://yugiohdeck.github.io/ and upload the file to see its content.',
				files: [{
					attachment: fileData,
					name: attachmentName,
				}],
			});

			await interaction.followUp({
				content: `File \`${originalFileName}\` sent successfully and renamed to \`${attachmentName}\`.`,
				ephemeral: true,
			});
		}
		catch (error) {
			console.error('Error uploading file:', error);
			return await interaction.followUp({
				content: 'An error occurred while uploading the file.',
				ephemeral: true,
			});
		}
	},
};

function generateRandomName() {
	const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomName = '';
	for (let i = 0; i < 10; i++) {
		randomName += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return randomName;
}

async function getFileData(attachment) {
	const response = await axios.get(attachment, {
		responseType: 'arraybuffer',
	});
	return response.data;
}
