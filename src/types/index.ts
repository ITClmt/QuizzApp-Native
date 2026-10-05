import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";

export interface User {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  username: string;
  lang: "fr" | "en";
  avatarSlug: string;
}

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  category: string;
  difficulty: string;
}

export interface QuizSession {
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  questions: QuizQuestion[];
}

export interface QuizAnswerResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface QuizResult {
  totalScore: number;
  details: { difficulty: string; value: number }[];
  answers: QuizAnswerResult[];
  xpEarned: number;
  previousLevel: number;
  level: number;
  leveledUp: boolean;
  unlockedCategoryIds: string[];
  unlockedAvatarSlugs: string[];
}

interface HistoryGameSummary {
  difficulty: Difficulty | null;
  category: string | null;
  status: "FINISHED" | "EXPIRED";
  createdAt: string;
  correctCount: number;
  totalQuestions: number;
}

export interface HistoryListItem extends HistoryGameSummary {
  id: string;
}

export interface HistoryAnswerRow {
  questionId: string;
  questionText: string;
  isCorrect: boolean;
  userAnswerText: string;
  correctAnswerText: string;
}

export interface HistoryDetail extends HistoryGameSummary {
  sessionId: string;
  answers: HistoryAnswerRow[];
}

export interface HistoryPage {
  items: HistoryListItem[];
  nextCursor: string | null;
}

export interface AvatarCatalogEntry {
  slug: string;
  unlockLevel: number;
  unlocked: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  lang: "fr" | "en";
  avatarSlug: string;
  xp: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  createdAt: string;
  updatedAt: string;
  /** Demandes d'ami reçues en attente — pastille du bouton Amis */
  pendingFriendRequests: number;
}

// --- Amis ---

/** Profil public d'un autre joueur : jamais d'email ni d'XP brute */
export interface FriendUser {
  id: string;
  username: string;
  avatarSlug: string;
  level: number;
}

export interface Friend {
  friendshipId: string;
  since: string;
  user: FriendUser;
}

export interface FriendRequest {
  id: string;
  createdAt: string;
  user: FriendUser;
}

export interface FriendRequests {
  received: FriendRequest[];
  sent: FriendRequest[];
}

export type FriendRelation = "none" | "friends" | "sent" | "received";

export interface FriendSearchResult {
  user: FriendUser;
  relation: FriendRelation;
  /** Présent quand relation vaut "sent" ou "received" */
  requestId?: string;
}

// --- Multijoueur ---

export type GameDifficulty = "easy" | "medium" | "hard";

export type GamePlayerStatus = "INVITED" | "JOINED" | "DECLINED" | "LEFT";

export type GamePhase =
  | "LOBBY"
  | "STARTING"
  | "QUESTION"
  | "REVEAL"
  | "FINISHED";

export type GameCancelReason =
  | "host_left"
  | "lobby_timeout"
  | "all_disconnected"
  | "all_left"
  | "server_error";

/** Même forme en REST (GET /games/invitations) et en direct (invitation:received) */
export interface GameInvitation {
  gameId: string;
  /** null = mixte */
  difficulty: GameDifficulty | null;
  createdAt: string;
  host: FriendUser;
  playerCount: number;
}

export interface ActiveGame {
  game: { id: string; status: "WAITING" | "PLAYING" } | null;
}

export interface LobbyPlayer {
  user: FriendUser;
  isHost: boolean;
  status: GamePlayerStatus;
  connected: boolean;
}

export interface Lobby {
  gameId: string;
  hostId: string;
  difficulty: GameDifficulty | null;
  phase: GamePhase;
  /** Joueurs présents nécessaires pour lancer (règle du serveur) */
  minPlayers: number;
  players: LobbyPlayer[];
}

/** Réponse du serveur à chaque évènement envoyé par le client */
export type SocketAck<T = null> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Question reçue en cours de partie : dans ma langue, jamais la bonne réponse */
export interface LiveQuestion {
  gameId: string;
  index: number;
  total: number;
  question: string;
  answers: string[];
  category: string;
  difficulty: string;
  /** Durée restante plutôt qu'une heure : l'horloge du téléphone n'est pas fiable */
  remainingMs: number;
  /** Durée totale de la question, fixée par le serveur */
  durationMs: number;
}

export interface RevealResult {
  userId: string;
  /** null = pas de réponse dans le temps */
  answerIndex: number | null;
  isCorrect: boolean;
  responseMs: number | null;
  score: number;
}

export interface GameReveal {
  gameId: string;
  index: number;
  correctIndex: number;
  results: RevealResult[];
}

/** Où en est la partie, renvoyé à chaque game:join une fois la partie lancée */
export interface LiveGameState {
  phase: GamePhase;
  questionIndex: number;
  total: number;
  question: LiveQuestion | null;
  myAnswerIndex: number | null;
  answeredUserIds: string[];
  reveal: GameReveal | null;
  remainingMs: number;
  scores: { userId: string; score: number }[];
}

export interface JoinedGame extends Lobby {
  /** null tant que la partie est dans le salon */
  state: LiveGameState | null;
}

export interface RankedPlayer {
  user: FriendUser;
  score: number;
  abandoned: boolean;
  /** null pour un abandon */
  rank: number | null;
  isWinner: boolean;
}

export interface GameProgression {
  xpEarned: number;
  previousLevel: number;
  level: number;
  leveledUp: boolean;
  unlockedCategoryIds: string[];
  unlockedAvatarSlugs: string[];
}

export interface GameEnd {
  gameId: string;
  ranking: RankedPlayer[];
  progression: GameProgression;
}
