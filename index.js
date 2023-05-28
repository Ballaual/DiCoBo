const client = require('./discordClient');

console.log('\x1b[33m%s\x1b[0m', 'Welcome to DiCoBo | https://github.com/ballaual/DiCoBo');

const errors = require('./events/errors');

const checkUpdates = require('./functions/checkUpdates');

const { deployCommands } = require('./handlers/deployCommands');
const handleCommands = require('./handlers/commandHandler');
const handleEvents = require('./handlers/eventHandler');

checkUpdates();
errors(client);
deployCommands(client);
handleCommands(client);
handleEvents(client);
