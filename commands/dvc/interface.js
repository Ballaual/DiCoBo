const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('interface')
		.setDescription('Creates the interface for managing dynamic voice channels')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const vcLock = new ButtonBuilder()
			.setCustomId('vcLock')
			.setLabel('🔒')
			.setStyle(ButtonStyle.Secondary);

		const vcUnlock = new ButtonBuilder()
			.setCustomId('vcUnlock')
			.setLabel('🔓')
			.setStyle(ButtonStyle.Secondary);

		/* const vcRename = new ButtonBuilder()
      .setCustomId('vcRename')
      .setLabel('✏️')
      .setStyle(ButtonStyle.Secondary);

    const vcBlock = new ButtonBuilder()
      .setCustomId('vcBlock')
      .setLabel('🚫')
      .setStyle(ButtonStyle.Secondary);

    const vcPermit = new ButtonBuilder()
      .setCustomId('vcPermit')
      .setLabel('✅')
      .setStyle(ButtonStyle.Secondary);

    const vcLimit = new ButtonBuilder()
      .setCustomId('vcLimit')
      .setLabel('👪')
      .setStyle(ButtonStyle.Secondary);

    const vcKick = new ButtonBuilder()
      .setCustomId('vcKick')
      .setLabel('❌')
      .setStyle(ButtonStyle.Secondary);*/

		const row1 = new ActionRowBuilder()
			.addComponents([vcLock, vcUnlock /* vcRename*/]);

		/* const row2 = new ActionRowBuilder()
      .addComponents([vcBlock, vcPermit, vcLimit, vcKick]);*/

		const embed = new EmbedBuilder()
			.setTitle('Voice Channel Interface')
			.setDescription('You can use this interface to manage your voice channel.\nYou can also use the slash commands!\n\n🔒 Lock\n🔓 Unlock')
		/* .setDescription('You can use this interface to manage your voice channel.\nYou can also use the slash commands!\n\n🔒 Lock\n🔓 Unlock\n✏️ Rename\n🚫 Block\n✅ Permit\n👪 Limit\n❌ Kick')*/
			.setFooter({ text: 'Use the buttons below to manage your voice channel!' });

		await interaction.reply({ content: 'The interface has been sent!', ephemeral: true });

		await interaction.channel.send({
			embeds: [embed],
			components: [row1.toJSON() /* row2.toJSON()*/],
		});
	},
};
