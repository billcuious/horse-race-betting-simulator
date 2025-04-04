
import { useState } from "react";
import { toast } from "sonner";
import { 
  GameState,
  Horse,
  applyTraining,
  scoutHorse,
  scoutOwnHorse,
  takeLoan,
  simulateRace,
  applyRandomEvent,
  updateHorsesAfterRace,
  RaceResult,
  RandomEvent
} from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";

export const useGameActions = (
  gameState: GameState | null,
  setGameState: (state: GameState) => void,
  addRaceResults: (raceNumber: number, results: RaceResult[]) => void,
  currentEvent: RandomEvent | null,
  pendingPassiveEvent: boolean,
  setCurrentEvent: (event: RandomEvent | null) => void,
  setEventProcessed: (processed: boolean) => void,
  resetEventState: () => void,
  setNextEvent: () => void
) => {
  const { t } = useLanguage();
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [trainingSelected, setTrainingSelected] = useState<boolean>(false);
  const [showingResults, setShowingResults] = useState<boolean>(false);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
  const [showBetWarning, setShowBetWarning] = useState<boolean>(false);
  const [currentBetAmount, setCurrentBetAmount] = useState<number>(100);
  
  const handleTrainingSelection = (type: "general" | "speed" | "rest" | "sync") => {
    if (!gameState) return;
    
    const updatedGameState = applyTraining(gameState, type);
    setGameState(updatedGameState);
    setTrainingSelected(true);
    
    const trainingName = t(`training.${type}`);
    toast.success(t("toast.success"), {
      description: `${trainingName} ${t("training.training")} ${t("action.confirm")}!`
    });
  };
  
  const handleScout = (horseId: string, type: "basic" | "deep") => {
    if (!gameState) return;
    
    if (horseId === gameState.playerHorse.id) {
      const updatedGameState = scoutOwnHorse(gameState);
      setGameState(updatedGameState);
      
      const revealedTrait = updatedGameState.playerHorse.revealedAttributes[
        updatedGameState.playerHorse.revealedAttributes.length - 1
      ]?.name;
      
      if (revealedTrait) {
        toast.success(t("toast.success"), {
          description: `${t("scout.button")}: ${t(`trait.${revealedTrait}`)}`
        });
      } else {
        toast.info(t("toast.info"), {
          description: t("trait.moreToDiscover")
        });
      }
    } else {
      const updatedGameState = scoutHorse(gameState, horseId, type);
      setGameState(updatedGameState);
      
      const horse = updatedGameState.competitors.find(h => h.id === horseId);
      if (!horse) return;
      
      if (type === "deep") {
        const revealedTrait = horse.revealedAttributes[horse.revealedAttributes.length - 1]?.name;
        
        if (revealedTrait) {
          toast.success(t("toast.success"), {
            description: `${t("scout.button")} ${horse.name}: ${t(`trait.${revealedTrait}`)}`
          });
        } else {
          toast.info(t("toast.info"), {
            description: t("trait.moreToDiscover")
          });
        }
      } else {
        toast.success(t("toast.success"), {
          description: `${t("scout.button")} ${horse.name} ${t("action.confirm")}`
        });
      }
    }
  };
  
  const handleTakeLoan = () => {
    if (!gameState) return;
    
    const updatedGameState = takeLoan(gameState);
    const loanAmount = calculateLoanAmount(gameState.playerMoney);
    
    // Get proper interest rate based on jockey
    const hasUnderhandedTactics = gameState.playerHorse.attributes.some(attr => attr.name === "Underhanded Tactics");
    const interestRate = hasUnderhandedTactics ? 0.4 : 0.25;
    const interestAmount = Math.floor(loanAmount * interestRate);
    
    setGameState(updatedGameState);
    toast.success(t("toast.success"), {
      description: `${t("horse.loanButton")} $${loanAmount} ${t("action.confirm")}! ${t("horse.interestNote").replace("{{interestAmount}}", interestAmount.toString())}`
    });
  };

  const calculateLoanAmount = (currentMoney: number): number => {
    return Math.floor(currentMoney * 0.5) + 200;
  };
  
  const handlePlaceBet = (horseId: string, amount: number) => {
    if (!gameState) return;
    
    if (gameState.playerMoney - amount < 100) {
      toast.error(t("toast.error"), {
        description: t("betWarning.max")
      });
      return;
    }
    
    const updatedGameState = { 
      ...gameState, 
      lastBet: { horseId, amount },
      playerMoney: gameState.playerMoney - amount
    };
    
    setGameState(updatedGameState);
    setBetPlaced(true);
    
    const horse = [...updatedGameState.competitors, updatedGameState.playerHorse].find(h => h.id === horseId);
    toast.success(t("toast.success"), {
      description: `${t("betting.place")} $${amount} ${t("betting.selectForBet")} ${horse?.name}`
    });
  };
  
  const handleStartRace = () => {
    if (!gameState) return;
    
    if (selectedHorseId && !betPlaced) {
      setShowBetWarning(true);
      return;
    }
    
    startRaceSequence();
  };
  
  const startRaceSequence = () => {
    if (!gameState) return;
    
    setRaceInProgress(true);
    
    setTimeout(() => {
      const raceResults = simulateRace(gameState);
      let updatedGameState = updateHorsesAfterRace({
        ...gameState,
        raceResults
      });
      
      // Apply pending passive event after race concludes
      if (currentEvent && currentEvent.type === "passive" && pendingPassiveEvent) {
        updatedGameState = applyRandomEvent(updatedGameState, currentEvent);
        
        // Show toast message about the applied passive event
        if (currentEvent.moneyEffect) {
          if (currentEvent.moneyEffect > 0) {
            toast.success(t("toast.success"), {
              description: `${t(currentEvent.title, currentEvent.title)}! +$${currentEvent.moneyEffect}`
            });
          } else {
            toast.error(t("toast.error"), {
              description: `${t(currentEvent.title, currentEvent.title)}! -$${Math.abs(currentEvent.moneyEffect)}`
            });
          }
        }
      }
      
      // Fix: Extract race results array from the updated game state
      // This fixes the type error by explicitly passing RaceResult[] instead of GameState
      const resultsToAdd = [...updatedGameState.raceResults];
      addRaceResults(gameState.currentRace, resultsToAdd);
      
      setGameState(updatedGameState);
      
      setRaceInProgress(false);
      setShowingResults(true);
      
      setTrainingSelected(false);
      setBetPlaced(false);
      setSelectedHorseId(null);
      resetEventState();
      
      // Set up next event for the next race
      if (!updatedGameState.playerMoney || updatedGameState.currentRace > updatedGameState.totalRaces) {
        // Game is over, don't set next event
      } else {
        setNextEvent();
      }
    }, 3000);
  };
  
  const handleCloseResults = () => {
    setShowingResults(false);
  };
  
  const handleAcceptEvent = () => {
    if (!gameState || !currentEvent) return;
    
    // Only handle choice events here now, passive events are handled after race
    if (currentEvent.type === "choice" && currentEvent.acceptEffect) {
      const { gameState: updatedGameState, message } = currentEvent.acceptEffect(gameState);
      setGameState(updatedGameState);
      
      toast.success(t("toast.success"), {
        description: t(message, message)
      });
    }
    
    setCurrentEvent(null);
    setEventProcessed(true);
  };
  
  const handleDismissEvent = () => {
    setCurrentEvent(null);
    setEventProcessed(true);
  };
  
  // Track the current bet amount
  const handleBetAmountChange = (amount: number) => {
    setCurrentBetAmount(amount);
  };

  return {
    selectedHorseId,
    setSelectedHorseId,
    trainingSelected,
    showingResults,
    setShowingResults,
    betPlaced,
    raceInProgress,
    showBetWarning,
    setShowBetWarning,
    currentBetAmount,
    handleTrainingSelection,
    handleScout,
    handleTakeLoan,
    handlePlaceBet,
    handleStartRace,
    startRaceSequence,
    handleCloseResults,
    handleAcceptEvent,
    handleDismissEvent,
    handleBetAmountChange
  };
};
