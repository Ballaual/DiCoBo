const { SlashCommandBuilder } = require('discord.js');
const { Connect4 } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect4')
		.setDescription('Play a game of Connect4 with another player')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('opponent')
				.setDescription('Select your opponent')
				.setRequired(true)),
	async execute(interaction) {
		const opponent = interaction.options.getUser('opponent');
		const game = new Connect4({
			message: interaction,
			isSlashGame: true,
			opponent,
			embed: {
				title: 'Connect4 Game',
				statusTitle: 'Status',
				color: '#5865F2',
			},
			emojis: {
				board: '⚪',
				player1: '🔴',
				player2: '🟡',
			},
			mentionUser: true,
			timeoutTime: 60000,
			buttonStyle: 'PRIMARY',
			turnMessage: '{emoji} | It\'s the turn of player **{player}**.',
			winMessage: '{emoji} | **{player}** won the Connect4 Game.',
			tieMessage: 'The game tied! No one won the game!',
			timeoutMessage: 'The game went unfinished! No one won the game!',
			playerOnlyMessage: `Only ${interaction.user} and ${opponent} can use these buttons.`,
		});

		game.startGame();
		game.on('gameOver', (result) => {
			console.log(result);
		});
	},
};
