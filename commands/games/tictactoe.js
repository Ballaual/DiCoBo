const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Play a game of Tic Tac Toe with another player')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('opponent')
				.setDescription('Select your opponent')
				.setRequired(true)),
	async execute(interaction) {
		const opponent = interaction.options.getUser('opponent');

		const game = new TicTacToe({
			message: interaction,
			isSlashGame: true,
			opponent: opponent,
			embed: {
				title: 'Tic Tac Toe',
				color: '#5865F2',
				statusTitle: 'Status',
				overTitle: 'Game Over',
			},
			emojis: {
				xButton: '❌',
				oButton: '🔵',
				blankButton: '➖',
			},
			mentionUser: true,
			timeoutTime: 60000,
			xButtonStyle: 'DANGER',
			oButtonStyle: 'PRIMARY',
			turnMessage: '{emoji} | It\'s {player}\'s turn.',
			winMessage: '{emoji} | **{player}** won the Tic Tac Toe game!',
			tieMessage: 'The game is tied! It\'s a draw.',
			timeoutMessage: 'The game went unfinished! No one won the game.',
			playerOnlyMessage: `Only {player} and ${opponent} can use these buttons.`,
		});

		game.startGame();
		game.on('gameOver', result => {
			console.log(result);
		});
	},
};
