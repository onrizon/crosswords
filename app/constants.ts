import { SupportedLanguage, WordData } from './types';

// Changed to a wider aspect ratio (approx 2:1) to fit desktop screens better
// Increased to 14x24 as requested
export const GRID_ROWS = 14;
export const GRID_COLS = 24;

// Fallback data in case API fails or for initial render before fetch
export const FALLBACK_WORDS: WordData[] = [
  {
    id: 1,
    word: 'TECLADO',
    clue: 'Usado para digitar',
    direction: 'H',
    start: { row: 6, col: 8 },
    isRevealed: false,
  },
  {
    id: 2,
    word: 'CADEIRA',
    clue: 'Onde se senta',
    direction: 'V',
    start: { row: 3, col: 9 },
    isRevealed: false,
  },
  {
    id: 3,
    word: 'DADOS',
    clue: 'Informações',
    direction: 'V',
    start: { row: 6, col: 13 },
    isRevealed: false,
  },
  {
    id: 4,
    word: 'REDE',
    clue: 'Conexão',
    direction: 'H',
    start: { row: 8, col: 9 },
    isRevealed: false,
  },
  {
    id: 5,
    word: 'MODEM',
    clue: 'Aparelho',
    direction: 'H',
    start: { row: 9, col: 12 },
    isRevealed: false,
  },
  {
    id: 6,
    word: 'EMAIL',
    clue: 'Correio',
    direction: 'V',
    start: { row: 8, col: 15 },
    isRevealed: false,
  },
  {
    id: 7,
    word: 'PASTA',
    clue: 'Arquivo',
    direction: 'V',
    start: { row: 5, col: 11 },
    isRevealed: false,
  },
  {
    id: 8,
    word: 'CAFE',
    clue: 'Bebida',
    direction: 'H',
    start: { row: 3, col: 9 },
    isRevealed: false,
  },
];

export const UI_TEXT: Record<
  SupportedLanguage,
  {
    live: string;
    offline: string;
    generating: string;
    time: string;
    progress: string;
    topPlayers: string;
    chatTitle: string;
    waitingForMessages: string;
    correct: string;
    guessed: string;
    levelComplete: string;
    newTheme: string;
    loadingTitle: string;
    loadingSubtitle: string;
    beFirst: string;
    streamOverlay: string;
    infoTitle: string;
    howToPlay: string;
    howToPlayDesc: string;
    commands: string;
    cmdDesc: string;
  }
> = {
  pt: {
    live: 'AO VIVO',
    offline: 'OFFLINE',
    generating: 'GERANDO...',
    time: 'TEMPO',
    progress: 'PROGRESSO',
    topPlayers: 'TOP JOGADORES',
    chatTitle: 'CHAT AO VIVO',
    waitingForMessages: 'Aguardando mensagens...',
    correct: 'ACERTOU!',
    guessed: 'acertou',
    levelComplete: 'NÍVEL COMPLETO! Gerando próximo...',
    newTheme: 'Novo tema',
    loadingTitle: 'CRIANDO CRUZADINHA...',
    loadingSubtitle: 'A IA ESTÁ CONECTANDO AS PALAVRAS',
    beFirst: 'Seja o primeiro a pontuar!',
    streamOverlay: 'STREAM OVERLAY',
    infoTitle: 'AJUDA & COMANDOS',
    howToPlay: 'COMO JOGAR',
    howToPlayDesc:
      'Espectadores: Digitem a resposta no chat (sem acentos). O primeiro a acertar ganha pontos!',
    commands: 'COMANDOS (ADMIN)',
    cmdDesc: 'Comandos disponíveis para o streamer no chat:',
  },
  en: {
    live: 'LIVE',
    offline: 'OFFLINE',
    generating: 'GENERATING...',
    time: 'TIME',
    progress: 'PROGRESS',
    topPlayers: 'TOP PLAYERS',
    chatTitle: 'LIVE CHAT',
    waitingForMessages: 'Waiting for messages...',
    correct: 'CORRECT!',
    guessed: 'guessed',
    levelComplete: 'LEVEL COMPLETE! Generating next...',
    newTheme: 'New theme',
    loadingTitle: 'CREATING CROSSWORD...',
    loadingSubtitle: 'AI IS CONNECTING THE WORDS',
    beFirst: 'Be the first to score!',
    streamOverlay: 'STREAM OVERLAY',
    infoTitle: 'HELP & COMMANDS',
    howToPlay: 'HOW TO PLAY',
    howToPlayDesc:
      'Viewers: Type the answer in chat. First to guess correctly gets points!',
    commands: 'COMMANDS (ADMIN)',
    cmdDesc: 'Commands available for the streamer in chat:',
  },
  fr: {
    live: 'EN DIRECT',
    offline: 'HORS LIGNE',
    generating: 'GÉNÉRATION...',
    time: 'TEMPS',
    progress: 'PROGRÈS',
    topPlayers: 'MEILLEURS JOUEURS',
    chatTitle: 'CHAT EN DIRECT',
    waitingForMessages: 'En attente de messages...',
    correct: 'CORRECT !',
    guessed: 'a deviné',
    levelComplete: 'NIVEAU TERMINÉ ! Génération du suivant...',
    newTheme: 'Nouveau thème',
    loadingTitle: 'CRÉATION DE MOTS CROISÉS...',
    loadingSubtitle: "L'IA CONNECTE LES MOTS",
    beFirst: 'Soyez le premier à marquer !',
    streamOverlay: 'SUPERPOSITION DE FLUX',
    infoTitle: 'AIDE & COMMANDES',
    howToPlay: 'COMMENT JOUER',
    howToPlayDesc:
      'Spectateurs : Tapez la réponse dans le chat. Le premier à deviner gagne des points !',
    commands: 'COMMANDES (ADMIN)',
    cmdDesc: 'Commandes disponibles pour le streamer dans le chat :',
  },
  de: {
    live: 'LIVE',
    offline: 'OFFLINE',
    generating: 'GENERIEREN...',
    time: 'ZEIT',
    progress: 'FORTSCHRITT',
    topPlayers: 'TOP SPIELER',
    chatTitle: 'LIVE-CHAT',
    waitingForMessages: 'Warten auf Nachrichten...',
    correct: 'RICHTIG!',
    guessed: 'hat erraten',
    levelComplete: 'LEVEL ABGESCHLOSSEN! Nächstes wird generiert...',
    newTheme: 'Neues Thema',
    loadingTitle: 'KREUZWORTRÄTSEL WIRD ERSTELLT...',
    loadingSubtitle: 'KI VERBINDET DIE WÖRTER',
    beFirst: 'Sei der Erste, der punktet!',
    streamOverlay: 'STREAM OVERLAY',
    infoTitle: 'HILFE & BEFEHLE',
    howToPlay: 'SPIELANLEITUNG',
    howToPlayDesc:
      'Zuschauer: Antwort in den Chat eingeben. Wer zuerst richtig rät, bekommt Punkte!',
    commands: 'BEFEHLE (ADMIN)',
    cmdDesc: 'Verfügbare Befehle für den Streamer im Chat:',
  },
  it: {
    live: 'IN DIRETTA',
    offline: 'OFFLINE',
    generating: 'GENERAZIONE...',
    time: 'TEMPO',
    progress: 'PROGRESSO',
    topPlayers: 'MIGLIORI GIOCATORI',
    chatTitle: 'CHAT DAL VIVO',
    waitingForMessages: 'In attesa di messaggi...',
    correct: 'CORRETTO!',
    guessed: 'ha indovinato',
    levelComplete: 'LIVELLO COMPLETATO! Generazione del prossimo...',
    newTheme: 'Nuovo tema',
    loadingTitle: 'CREAZIONE CRUCIVERBA...',
    loadingSubtitle: "L'IA STA COLLEGANDO LE PAROLE",
    beFirst: 'Sii il primo a segnare!',
    streamOverlay: 'STREAM OVERLAY',
    infoTitle: 'AIUTO & COMANDI',
    howToPlay: 'COME GIOCARE',
    howToPlayDesc:
      'Spettatori: Digitate la risposta in chat. Il primo a indovinare ottiene punti!',
    commands: 'COMANDI (ADMIN)',
    cmdDesc: 'Comandi disponibili per lo streamer nella chat:',
  },
  es: {
    live: 'EN VIVO',
    offline: 'DESCONECTADO',
    generating: 'GENERANDO...',
    time: 'TIEMPO',
    progress: 'PROGRESO',
    topPlayers: 'MEJORES JUGADORES',
    chatTitle: 'CHAT EN VIVO',
    waitingForMessages: 'Esperando mensajes...',
    correct: '¡CORRECTO!',
    guessed: 'adivinó',
    levelComplete: '¡NIVEL COMPLETADO! Generando siguiente...',
    newTheme: 'Nuevo tema',
    loadingTitle: 'CREANDO CRUCIGRAMA...',
    loadingSubtitle: 'LA IA ESTÁ CONECTANDO LAS PALABRAS',
    beFirst: '¡Sé el primero en puntuar!',
    streamOverlay: 'SUPERPOSICIÓN DE STREAM',
    infoTitle: 'AYUDA & COMANDOS',
    howToPlay: 'CÓMO JUGAR',
    howToPlayDesc:
      'Espectadores: Escriban la respuesta en el chat. ¡El primero en adivinar gana puntos!',
    commands: 'COMANDOS (ADMIN)',
    cmdDesc: 'Comandos disponibles para el streamer en el chat:',
  },
};
