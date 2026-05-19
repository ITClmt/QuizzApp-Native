interface User {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  username: string;
  lang: "fr" | "en";
  avatarSlug: string;
}

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

// Quiz types

interface QuizQuestion {
  id: string;
  questionEn: string;
  questionFr: string | null; // Null si la traduction FR n'existe pas encore
  answers: string[]; // Déjà shuffled par le backend
  correctIndex: number; // Index de la bonne réponse dans answers[]
  category: string;
  difficulty: string;
}

interface QuizSession {
  sessionId: string;
  expiresAt: string;
  questions: QuizQuestion[];
}

interface QuizAnswerResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
}

interface QuizResult {
  totalScore: number;
  details: { difficulty: string; value: number }[];
  answers: QuizAnswerResult[];
}
