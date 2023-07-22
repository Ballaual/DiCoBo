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

	const vcPermit = new ButtonBuilder()
		.setCustomId('vcPermit')
		.setLabel('✅')
		.setStyle(ButtonStyle.Secondary);

	const vcBlock = new ButtonBuilder()
		.setCustomId('vcBlock')
		.setLabel('🚫')
		.setStyle(ButtonStyle.Secondary);

	const vcKick = new ButtonBuilder()
		.setCustomId('vcKick')
		.setLabel('❌')
		.setStyle(ButtonStyle.Secondary);

  	const vcLimit = new ButtonBuilder()
		.setCustomId('vcLimit')
		.setLabel('👪')
		.setStyle(ButtonStyle.Secondary);

	const row1 = new ActionRowBuilder()
		.addComponents([vcLock, vcUnlock, vcRename]);

	const row2 = new ActionRowBuilder()
  		.addComponents([vcPermit, vcBlock, vcKick, vcLimit]);

	const embed = new EmbedBuilder()
		.setTitle('Voice Channel Interface')
		.setDescription('You can use this interface to manage your voice channel.\nYou can also use the slash commands!\n\n🔒 Lock\n🔓 Unlock\n✏️ Rename')
		.setFooter({ text: 'Use the buttons below to manage your voice channel!' });

	await channel.send({
		embeds: [embed],
		components: [row1.toJSON(), row2.toJSON()],
	});
}

module.exports = {
	vcInterface,
};
