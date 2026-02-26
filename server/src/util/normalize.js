export function normalizeWord(text) {
  return text
    .trim()
    .toUpperCase()
    .replace(/Ç/g, 'C')
    .replace(/[ÁÀÂÃÄ]/g, 'A')
    .replace(/[ÉÊË]/g, 'E')
    .replace(/[ÍÏ]/g, 'I')
    .replace(/[ÓÔÕÖ]/g, 'O')
    .replace(/[ÚÜ]/g, 'U')
    .replace(/Ñ/g, 'N')
    .replace(/ß/g, 'SS')
    .replace(/(\s|-)+/g, '');
}
