const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function vcInterface(channel) {
	const vcLock = new ButtonBuilder()
		.setCustomId('vcLock')
		.setLabel('🔒')
		.setStyle(ButtonStyle.Secondary);

	const vcUnlock = new ButtonBuilder()
		.setCustomId('vcUnlock')
		.setLabel('🔓')
		.setStyle(ButtonStyle.Secondary);

	const vcRename = new ButtonBuilder()
		.setCustomId('vcRename')
		.setLabel('✏️')
		.setStyle(ButtonStyle.Secondary);

	const vcLimit = new ButtonBuilder()
		.setCustomId('vcLimit')
		.setLabel('👪')
		.setStyle(ButtonStyle.Secondary);

	const row1 = new ActionRowBuilder()
		.addComponents([vcLock, vcUnlock, vcRename, vcLimit]);

	const embed = new EmbedBuilder()
		.setTitle('Voice Channel Interface')
		.setDescription('You can use this interface to manage your voice channel.\nYou can also use the `/vc slash commands!`\n\n🔒 Lock\n🔓 Unlock\n✏️ Rename')
		.setFooter({ text: 'Use the buttons below to manage your voice channel!' });

	await channel.send({
		embeds: [embed],
		components: [row1.toJSON()],
	});
}

module.exports = {
	vcInterface,
};
