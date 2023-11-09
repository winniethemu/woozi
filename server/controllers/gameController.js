// gameController.js
const socketHelper = require('./utils/socket');

const players = new Map(); // Store player info, keyed by socket ID
const games = new Map(); // Store game state info, keyed by room ID

// Function to handle a new player joining a game
function playerJoined(socket, playerInfo) {
  // Add the player to our players map
  players.set(socket.id, playerInfo);
  socketHelper.joinRoom(socket, playerInfo.roomID);

  // Initialize game state if it doesn't exist
  if (!games.has(playerInfo.roomID)) {
    games.set(playerInfo.roomID, {
      players: [],
      state: 'waiting', // waiting, night, day, voting, ended
      roles: [],
      actions: []
    });
  }

  // Add player to the game
  const game = games.get(playerInfo.roomID);
  game.players.push({
    socketId: socket.id,
    name: playerInfo.name,
    role: null, // Role will be assigned when the game starts
    alive: true
  });

  // Notify others in the room that a new player has joined
  socketHelper.broadcastToRoom(socket, playerInfo.roomID, 'playerJoined', { name: playerInfo.name });
}

// Function to start the game
function startGame(roomID) {
  const game = games.get(roomID);
  game.state = 'night';
  assignRoles(roomID);

  // Notify players in the room that the game has started
  socketHelper.emitToRoom(roomID, 'gameStarted', { roles: game.roles });
  // More logic here for starting the night phase...
}

// Function to assign roles to players randomly
function assignRoles(roomID) {
  // Example of assigning roles, this would be more complex in a real game
  const game = games.get(roomID);
  const availableRoles = ['werewolf', 'seer', 'villager']; // This should be dynamic based on the game settings
  game.players.forEach(player => {
    player.role = availableRoles[Math.floor(Math.random() * availableRoles.length)];
    game.roles.push(player.role);
  });
}

// Function to handle a player's action during the night
function playerAction(socket, action) {
  // Example of handling a player action, this would depend on the role
  const player = players.get(socket.id);
  const game = games.get(player.roomID);
  if (game.state !== 'night') return;

  // Record the action
  game.actions.push({
    socketId: socket.id,
    action: action
  });

  // Check if all actions are done to move to the day phase
  // ...

  // Notify the player that their action was recorded
  socket.emit('actionReceived');
}

// Function to end the night phase and start the day phase
function endNight(roomID) {
  const game = games.get(roomID);
  game.state = 'day';
  // Handle the outcome of the night, e.g., apply werewolf attacks
  // ...

  // Notify players to start the day phase
  socketHelper.emitToRoom(roomID, 'startDay');
  // More logic for day phase...
}

// Export the functions to be used by the Socket.io event handlers
module.exports = {
  playerJoined,
  startGame,
  playerAction,
  endNight
};
