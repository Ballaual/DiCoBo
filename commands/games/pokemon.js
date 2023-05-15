const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guesspokemon')
		.setDescription('Play a game of Guess the Pokémon')
		.setDMPermission(false),
	category: 'games',
	async execute(interaction) {
		const game = new GuessThePokemon({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Who"s The Pokémon',
				color: '#5865F2',
			},
			timeoutTime: 60000,
			winMessage: 'You guessed it right! It was a {pokemon}.',
			loseMessage: 'Better luck next time! It was a {pokemon}.',
			errMessage: 'Unable to fetch Pokémon data! Please try again.',
			playerOnlyMessage: 'Only {player} can use these buttons.',
		});

		game.startGame();
		game.on('gameOver', result => {
			console.log(result);
		});
	},
};
