const { SlashCommandBuilder } = require('discord.js');
const { Minesweeper } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minesweeper')
		.setDescription('Play a game of Minesweeper')
		.setDMPermission(false),
	category: 'games',
	async execute(interaction) {
		const game = new Minesweeper({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Minesweeper',
				color: '#5865F2',
				description: 'Click on the buttons to reveal the blocks except mines.',
			},
			emojis: { flag: '🚩', mine: '💣' },
			mines: 5,
			timeoutTime: 60000,
			winMessage: 'You won the Game! You successfully avoided all the mines.',
			loseMessage: 'You lost the Game! Be aware of the mines next time.',
			playerOnlyMessage: 'Only {player} can use these buttons.',
		});

		game.startGame();
		game.on('gameOver', result => {
			console.log(result);
		});
	},
};
