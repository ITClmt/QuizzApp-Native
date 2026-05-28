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
  questionEn: string;
  questionFr: string | null;
  answers: string[];
  correctIndex: number;
  category: string;
  difficulty: string;
}

export interface QuizSession {
  sessionId: string;
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
}
