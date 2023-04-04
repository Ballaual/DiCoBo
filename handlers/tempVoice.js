const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function tempVoice(interaction) {
  // Get the trigger channel, category, and channel name from the slash command options
  const triggerChannel = interaction.options.getChannel('channel');
  const category = interaction.options.getChannel('category');
  const name = interaction.options.getString('name');

  // Load the data from the JSON file
  const guildID = interaction.guild.id;
  const dataFilePath = path.join(__dirname, '..', 'configs', `${guildID}.json`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataFilePath));
  } catch (err) {
    // Create the configs folder and the guild-specific JSON file if they don't exist
    fs.mkdirSync(path.join(__dirname, '..', 'configs'), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
    data = {};
  }

  // Ensure that the user has the necessary permissions to set up the trigger channel
  const member = interaction.member;
  if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return interaction.reply({
      content: 'You do not have permission to set up the trigger channel.',
      ephemeral: true
    });
  }

  // Save the trigger channel and category ID to the data object
  data[triggerChannel.id] = {
    category: category.id,
    name: name.trim(),
    createdChannels: {}
  };

  // Write the updated data back to the JSON file
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

  // Create a new listener for the trigger channel
  const listener = async (oldState, newState) => {
  // Check if a user joined the trigger channel
  if (!oldState.channelId && newState.channelId === triggerChannel.id) {
    // Validate the channel name
    const channelName = name.trim();
    if (!channelName) {
      return console.error('Invalid channel name:', name);
    }

    // Check if the channel name is too long
    if (channelName.length > 100) {
      return console.error('Channel name is too long:', channelName);
    }

  // Create a new temporary voice channel in the specified category
  const newChannel = await triggerChannel.guild.channels.create({
  name: channelName,
  type: 2,
  parent: category,
  // your permission overwrites or other options here
  });

    // Move the user to the new temporary voice channel
    await newState.member.voice.setChannel(newChannel);

    // Add the new temporary channel to the data object
    data[triggerChannel.id].createdChannels[newChannel.id] = {
      name: channelName,
      category: category.id,
      owner: newState.member.id
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    // Add the onLeave listener to the client
    const onLeave = async (oldState, newState) => {
      if (oldState.channelId === newChannel.id && newChannel.members.size === 0) {
        // Delete the temporary channel when it becomes empty
        await newChannel.delete();
    
        // Remove the temporary channel data from the data object
        delete data[triggerChannel.id].createdChannels[newChannel.id];
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
        // Remove the onLeave listener from the client
        client.off('voiceStateUpdate', onLeave);
      }
    };    

    // Add the onLeave listener to the client
    client.on('voiceStateUpdate', onLeave);
  }
};

// Add the listener to the client
const client = interaction.client;
client.on('voiceStateUpdate', listener);
  
      // Reply to the user with a success message
      await interaction.reply({
          content: `The trigger channel has been set to ${triggerChannel} and the temporary voice channels will be created in the ${category} category with the name ${name}.`,
          ephemeral: true
      });
}

module.exports = tempVoice;