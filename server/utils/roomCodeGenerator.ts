import Room from '../models/room';

function generateRoomCode(length = 4) {
  // Skip char 'O' as it may confuse the user
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function generateUniqueRoomCode() {
  let roomCode = '';
  let isUnique = false;

  while (!isUnique) {
    roomCode = generateRoomCode();
    // Check if the room code already exists in the database
    const roomExists = await Room.findOne({ code: roomCode });
    if (!roomExists) {
      isUnique = true;
    }
  }

  return roomCode;
}

export default generateUniqueRoomCode;
