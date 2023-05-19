const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    try {
      const { user, guild } = member;
      const serverName = guild.name;
      const dmChannel = await user.createDM();
      await dmChannel.send(`Hello ${user.username}, welcome to \`${serverName}\`!`);
    } catch (error) {
      console.error('There was an error sending the dm:', error);
    }
  },
};
