const { SlashCommandBuilder } = require('discord.js');
const { Slots } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Play with the Slot Machine')
		.setDMPermission(false),
	async execute(interaction) {
		const game = new Slots({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Slot Machine',
				color: '#5865F2',
			},
			slots: ['🍇', '🍊', '🍋', '🍌'],
		});

		game.startGame();
		game.on('gameOver', result => {
			console.log(result);
		});
	},
};
