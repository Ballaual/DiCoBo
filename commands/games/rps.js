const { SlashCommandBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play a game Rock Paper Scissors with another player')
		.setDMPermission(false)
		.addUserOption(option => option
			.setName('opponent')
			.setDescription('Select your opponent')
			.setRequired(true)),
	async execute(interaction) {
		const opponent = interaction.options.getUser('opponent');

		const game = new RockPaperScissors({
			message: interaction,
			isSlashGame: true,
			opponent: opponent,
			embed: {
				title: 'Rock Paper Scissors',
				color: '#5865F2',
				description: 'Press a button below to make a choice.',
			},
			buttons: {
				rock: 'Rock',
				paper: 'Paper',
				scissors: 'Scissors',
			},
			emojis: {
				rock: '🌑',
				paper: '📰',
				scissors: '✂️',
			},
			mentionUser: true,
			timeoutTime: 60000,
			buttonStyle: 'PRIMARY',
			pickMessage: 'You choose {emoji}.',
			winMessage: '**{player}** won the Game! Congratulations!',
			tieMessage: 'The Game tied! No one won the Game!',
			timeoutMessage: 'The Game went unfinished! No one won the Game!',
			playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
		});

		game.startGame();
		game.on('gameOver', result => {
			console.log(result);
		});
	},
};
