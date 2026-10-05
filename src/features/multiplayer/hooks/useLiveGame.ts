import {
  useMultiplayer,
  useSocketEvent,
} from "@/src/contexts/MultiplayerContext";
import type {
  GameEnd,
  GamePhase,
  GameReveal,
  JoinedGame,
  Lobby,
  LiveQuestion,
} from "@/src/types";
import { useCallback, useReducer } from "react";
import { useJoinGame } from "./useJoinGame";

// --- État ---

type State = {
  /** Joueurs, statuts et présence (lobby:update continue d'arriver en partie) */
  lobby: Lobby | null;
  phase: GamePhase | null;
  question: LiveQuestion | null;
  /** Fin de la question, en heure locale : maintenant + remainingMs à la réception */
  deadline: number | null;
  myAnswerIndex: number | null;
  /** Le serveur a refusé ma réponse : elle est arrivée trop tard */
  answerRejected: boolean;
  answeredUserIds: string[];
  reveal: GameReveal | null;
  /** Ceux qui jouent (JOINED au lancement), dans l'ordre du serveur */
  scores: { userId: string; score: number }[];
};

type Action =
  | { type: "joined"; game: JoinedGame }
  | { type: "lobby"; lobby: Lobby }
  | { type: "question"; question: LiveQuestion }
  | { type: "answered"; userId: string }
  | { type: "myAnswer"; answerIndex: number }
  | { type: "answerRejected" }
  | { type: "reveal"; reveal: GameReveal };

const initialState: State = {
  lobby: null,
  phase: null,
  question: null,
  deadline: null,
  myAnswerIndex: null,
  answerRejected: false,
  answeredUserIds: [],
  reveal: null,
  scores: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Premier affichage comme reconnexion : on repart de l'état du serveur
    case "joined": {
      const { state: live, ...lobby } = action.game;
      if (!live) return { ...state, lobby, phase: lobby.phase };
      return {
        ...state,
        lobby,
        phase: live.phase,
        question: live.question,
        // Pendant la révélation, la question est fournie mais le temps restant
        // est celui de la révélation : pas de timer à afficher
        deadline:
          live.phase === "QUESTION" && live.question
            ? Date.now() + live.question.remainingMs
            : null,
        myAnswerIndex: live.myAnswerIndex,
        answerRejected: false,
        answeredUserIds: live.answeredUserIds,
        reveal: live.reveal,
        scores: live.scores,
      };
    }
    case "lobby":
      return { ...state, lobby: action.lobby };
    case "question":
      return {
        ...state,
        phase: "QUESTION",
        question: action.question,
        deadline: Date.now() + action.question.remainingMs,
        myAnswerIndex: null,
        answerRejected: false,
        answeredUserIds: [],
        reveal: null,
      };
    case "answered":
      return state.answeredUserIds.includes(action.userId)
        ? state
        : {
            ...state,
            answeredUserIds: [...state.answeredUserIds, action.userId],
          };
    case "myAnswer":
      return { ...state, myAnswerIndex: action.answerIndex };
    case "answerRejected":
      return { ...state, answerRejected: true };
    case "reveal":
      return {
        ...state,
        phase: "REVEAL",
        reveal: action.reveal,
        deadline: null,
        scores: action.reveal.results.map(({ userId, score }) => ({
          userId,
          score,
        })),
      };
  }
}

// --- Hook ---

/**
 * Une partie en cours, tenue à jour en direct. Le serveur est le seul maître :
 * l'écran ne fait qu'afficher ce qu'il reçoit et envoyer les réponses.
 * Quitter (`leave`) en cours de partie vaut abandon.
 */
export function useLiveGame(
  gameId: string,
  handlers: {
    onReveal: (reveal: GameReveal) => void;
    onEnd: (end: GameEnd) => void;
  },
) {
  const { emit } = useMultiplayer();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { joinError, canceledReason, leave } = useJoinGame<JoinedGame>(
    gameId,
    (game) => dispatch({ type: "joined", game }),
  );

  useSocketEvent<Lobby>("lobby:update", (lobby) => {
    if (lobby.gameId === gameId) dispatch({ type: "lobby", lobby });
  });

  useSocketEvent<LiveQuestion>("question", (question) => {
    if (question.gameId === gameId) dispatch({ type: "question", question });
  });

  useSocketEvent<{ gameId: string; userId: string }>(
    "player:answered",
    (event) => {
      if (event.gameId === gameId) {
        dispatch({ type: "answered", userId: event.userId });
      }
    },
  );

  useSocketEvent<GameReveal>("reveal", (reveal) => {
    if (reveal.gameId !== gameId) return;
    dispatch({ type: "reveal", reveal });
    handlers.onReveal(reveal);
  });

  useSocketEvent<GameEnd>("game:end", (end) => {
    if (end.gameId === gameId) handlers.onEnd(end);
  });

  const answer = useCallback(
    (answerIndex: number) => {
      if (state.phase !== "QUESTION" || state.myAnswerIndex !== null) return;
      const questionIndex = state.question?.index;
      if (questionIndex === undefined) return;

      // Affichée tout de suite : attendre l'ack coûterait du temps de réponse
      dispatch({ type: "myAnswer", answerIndex });
      emit("answer", { gameId, questionIndex, answerIndex }).then((ack) => {
        if (!ack.ok) dispatch({ type: "answerRejected" });
      });
    },
    [state.phase, state.myAnswerIndex, state.question?.index, emit, gameId],
  );

  return { ...state, joinError, canceledReason, answer, leave };
}
