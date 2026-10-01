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
