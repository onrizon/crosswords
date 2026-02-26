const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function generateUniqueRoomCode(existingCodes) {
  let code;
  do {
    code = generateRoomCode();
  } while (existingCodes.has(code));
  return code;
}
