
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  GameState,
  Horse, 
  initializeGame,
  RaceResult,
  RandomEvent,
  getRandomEvent,
  isGameOver,
  isGameWon
} from "@/utils/gameLogic";

export const useGameState = (playerName: string, jockeyId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [pendingPassiveEvent, setPendingPassiveEvent] = useState<boolean>(false);
  const [eventProcessed, setEventProcessed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [seasonResults, setSeasonResults] = useState<{raceNumber: number; results: RaceResult[]}[]>([]);

  useEffect(() => {
    const newGame = initializeGame(playerName || "Player", jockeyId);
    setGameState(newGame);
    
    // Get the first event
    const firstEvent = getRandomEvent();
    setCurrentEvent(firstEvent);
    
    // If it's a passive event, mark it as pending instead of
    // immediately applying it
    if (firstEvent && firstEvent.type === "passive") {
      setPendingPassiveEvent(true);
    }
  }, [playerName, jockeyId]);

  const updateGameState = (newState: GameState) => {
    if (newState.playerMoney < 100) {
      setGameState({
        ...newState,
        playerMoney: 0
      });
      setGameEnded(true);
    } else {
      setGameState(newState);
      
      if (isGameOver(newState)) {
        setGameEnded(true);
      }
    }
  };

  const addRaceResults = (raceNumber: number, results: RaceResult[]) => {
    setSeasonResults(prev => [
      ...prev, 
      { 
        raceNumber, 
        results 
      }
    ]);
  };

  const resetEventState = () => {
    setPendingPassiveEvent(false);
    setEventProcessed(false);
  };

  const setNextEvent = () => {
    // Get new event for next race
    const nextEvent = getRandomEvent();
    setCurrentEvent(nextEvent);
    
    // If it's a passive event, mark it as pending
    if (nextEvent && nextEvent.type === "passive") {
      setPendingPassiveEvent(true);
    } else {
      setPendingPassiveEvent(false);
    }
    
    setEventProcessed(false);
  };

  return {
    gameState,
    setGameState: updateGameState,
    currentEvent,
    setCurrentEvent,
    pendingPassiveEvent,
    setPendingPassiveEvent,
    eventProcessed,
    setEventProcessed,
    gameEnded,
    setGameEnded,
    seasonResults,
    addRaceResults,
    resetEventState,
    setNextEvent
  };
};
