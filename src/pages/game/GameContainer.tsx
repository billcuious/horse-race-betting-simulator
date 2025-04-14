
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GameHeader from "./components/GameHeader";
import GameProgress from "./components/GameProgress";
import RandomEventHandler from "./components/RandomEventHandler";
import HorseManagement from "./components/HorseManagement";
import CompetitorsPanel from "./components/CompetitorsPanel";
import BettingAndRacePanel from "./components/BettingAndRacePanel";
import RaceResults from "@/components/RaceResults";
import GameEndScreen from "./GameEndScreen";
import BetWarningDialog from "@/components/BetWarningDialog";
import TutorialDialog from "@/components/TutorialDialog";
import { 
  GameState,
  Horse, 
  initializeGame,
  applyTraining,
  scoutHorse,
  scoutOwnHorse,
  takeLoan,
  simulateRace,
  getRandomEvent,
  applyRandomEvent,
  SCOUTING_COSTS,
  RandomEvent,
  calculateLoanAmount,
  isGameOver,
  isGameWon,
  RaceResult
} from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";

const GameContainer = ({
  playerName,
  jockeyId,
  onResetGame
}: {
  playerName: string;
  jockeyId: string;
  onResetGame: () => void;
}) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [trainingSelected, setTrainingSelected] = useState<boolean>(false);
  const [showingResults, setShowingResults] = useState<boolean>(false);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [pendingPassiveEvent, setPendingPassiveEvent] = useState<boolean>(false);
  const [eventProcessed, setEventProcessed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [seasonResults, setSeasonResults] = useState<{raceNumber: number; results: RaceResult[]}[]>([]);
  const [showBetWarning, setShowBetWarning] = useState<boolean>(false);
  const [currentBetAmount, setCurrentBetAmount] = useState<number>(100);
  
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
      
      // Calculate earnings from race
      const playerResult = raceResults.find(r => r.horseId === gameState.playerHorse.id);
      const playerPosition = playerResult?.position || 0;
      
      // Calculate race earnings
      let earnings = 0;
      if (playerPosition === 1) {
        earnings = 1000;
      } else if (playerPosition === 2) {
        earnings = 500;
      } else if (playerPosition === 3) {
        earnings = 250;
      } else if (playerPosition === raceResults.length && gameState.selectedJockeyId === "underhanded") {
        // Last place bonus for underhanded jockey
        earnings = 1000;
      }
      
      // Celebrity jockey effect: half prize money for top 3, but $300 bonus
      if (gameState.selectedJockeyId === "celebrity") {
        if (playerPosition <= 3) {
          earnings = Math.floor(earnings / 2);
        }
        earnings += 300;
      }
      
      // One shot specialist bonus for race 10
      if (gameState.selectedJockeyId === "oneshot" && gameState.currentRace === 10) {
        // Double earnings for race 10
        earnings *= 2;
      }
      
      // Process betting result
      if (gameState.lastBet) {
        const betHorseResult = raceResults.find(r => r.horseId === gameState.lastBet?.horseId);
        const betPosition = betHorseResult?.position || 0;
        
        if (betPosition === 1) {
          earnings += gameState.lastBet.amount * 4;
        } else if (betPosition === 2) {
          earnings += gameState.lastBet.amount * 2;
        } else if (betPosition === 3) {
          earnings += Math.floor(gameState.lastBet.amount * 1.5);
        }
      }
      
      // Update game state with race results and other changes
      let updatedGameState = {
        ...gameState,
        playerMoney: gameState.playerMoney + earnings,
        raceResults: raceResults,
        currentRace: gameState.currentRace + 1,
        hasUsedLoanThisRace: false
      };
      
      // Update horses after race (apply fatigue, recovery changes, etc.)
      const updatedPlayerHorse = { ...updatedGameState.playerHorse };
      
      // Apply fatigue and recovery
      updatedPlayerHorse.endurance = Math.max(1, updatedPlayerHorse.endurance - 3);
      updatedPlayerHorse.recovery = Math.max(1, updatedPlayerHorse.recovery - 5);
      
      // Apply additional fatigue for special jockeys
      if (gameState.selectedJockeyId === "extreme") {
        updatedPlayerHorse.endurance = Math.max(1, updatedPlayerHorse.endurance - 2); // 1.4x faster depletion
      } else if (gameState.selectedJockeyId === "slippery") {
        updatedPlayerHorse.displayedSpeed = Math.max(1, updatedPlayerHorse.displayedSpeed - 2); // 15% faster decline
        updatedPlayerHorse.actualSpeed = Math.max(1, updatedPlayerHorse.actualSpeed - 2);
      } else if (gameState.selectedJockeyId === "oneshot" && gameState.currentRace === 10) {
        // Double stat decline after race 10
        updatedPlayerHorse.displayedSpeed = Math.max(1, updatedPlayerHorse.displayedSpeed - 4);
        updatedPlayerHorse.actualSpeed = Math.max(1, updatedPlayerHorse.actualSpeed - 4);
        updatedPlayerHorse.control = Math.max(1, updatedPlayerHorse.control - 4);
        updatedPlayerHorse.recovery = Math.max(1, updatedPlayerHorse.recovery - 4);
        updatedPlayerHorse.endurance = Math.max(1, updatedPlayerHorse.endurance - 4);
      }
      
      // Apply extreme trainer jockey effect for potential new trait
      if (gameState.selectedJockeyId === "extreme" && 
          updatedGameState.currentRace >= 4 && 
          !updatedPlayerHorse.traitRevealRace) {
        updatedPlayerHorse.traitRevealRace = gameState.currentRace + Math.floor(Math.random() * 5) + 1; // 1-5 races from now
      }
      
      // Check if it's time for extreme trainer to reveal a new trait
      if (gameState.selectedJockeyId === "extreme" && 
          updatedPlayerHorse.traitRevealRace === gameState.currentRace) {
        // Add a new positive trait
        const positiveTraits = ["Natural Talent", "Endurance Beast", "Fast Starter", "Light Frame", 
                      "Consistent", "Sprint Specialist", "Stamina Monster", "Late Bloomer", 
                      "Fast Recovery", "Precision Movement", "Natural Competitor", "Lucky"];
                      
        // Find traits not already on the horse
        const availableTraits = positiveTraits.filter(trait => 
          !updatedPlayerHorse.attributes.some(attr => attr.name === trait)
        );
        
        if (availableTraits.length > 0) {
          const newTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
          const traitEffect = (horse: Horse) => {
            // Logic handled in TRAIT_EFFECTS
          };
          
          updatedPlayerHorse.attributes.push({
            name: newTrait,
            description: `This horse ${newTrait.toLowerCase()} trait affects its performance.`,
            isPositive: true,
            effect: traitEffect
          });
          
          updatedPlayerHorse.revealedAttributes.push({
            name: newTrait,
            description: `This horse ${newTrait.toLowerCase()} trait affects its performance.`,
            isPositive: true,
            effect: traitEffect
          });
          
          toast.success("New Trait Discovered!", {
            description: `Your horse has developed the ${newTrait} trait!`
          });
        }
        
        updatedPlayerHorse.traitRevealRace = undefined;
      }
      
      // Also update competitor horses
      const updatedCompetitors = updatedGameState.competitors.map(horse => {
        const updatedHorse = { ...horse };
        
        // Apply similar fatigue effects to competitors
        updatedHorse.endurance = Math.max(1, updatedHorse.endurance - 2);
        updatedHorse.recovery = Math.max(1, updatedHorse.recovery - 3);
        
        return updatedHorse;
      });
      
      updatedGameState = {
        ...updatedGameState,
        playerHorse: updatedPlayerHorse,
        competitors: updatedCompetitors
      };
      
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
      
      // Repay loan with interest if this is race 5 or 10
      if (gameState.currentRace === 5 || gameState.currentRace === 10) {
        const hasUnderhandedTactics = gameState.playerHorse.attributes.some(attr => attr.name === "Underhanded Tactics");
        const interestRate = hasUnderhandedTactics ? 0.4 : 0.25;
        const interestAmount = Math.floor(updatedGameState.loanAmount * interestRate);
        const totalDebt = updatedGameState.loanAmount + interestAmount;
        
        if (updatedGameState.playerMoney >= totalDebt) {
          updatedGameState.playerMoney -= totalDebt;
          updatedGameState.loanAmount = 0;
          
          toast.success(`Loan repaid with $${interestAmount} interest!`);
        } else if (updatedGameState.loanAmount > 0) {
          // Can't repay, game over handled
          updatedGameState.playerMoney = 0;
          toast.error(`Couldn't repay loan of $${totalDebt}!`);
        }
      }
      
      setSeasonResults(prev => [
        ...prev, 
        { 
          raceNumber: gameState.currentRace, 
          results: updatedGameState.raceResults 
        }
      ]);
      
      if (updatedGameState.playerMoney < 100) {
        setGameState({
          ...updatedGameState,
          playerMoney: 0
        });
        setGameEnded(true);
        toast.error("You've gone bankrupt!", {
          description: "You don't have enough money to continue racing."
        });
      } else {
        setGameState(updatedGameState);
      }
      
      setRaceInProgress(false);
      setShowingResults(true);
      
      setTrainingSelected(false);
      setBetPlaced(false);
      setSelectedHorseId(null);
      setPendingPassiveEvent(false);
      
      if (isGameOver(updatedGameState) || updatedGameState.playerMoney < 100) {
        setGameEnded(true);
      } else {
        // Get new event for next race
        const nextEvent = getRandomEvent();
        setCurrentEvent(nextEvent);
        
        // If it's a passive event, mark it as pending
        if (nextEvent && nextEvent.type === "passive") {
          setPendingPassiveEvent(true);
        }
        
        setEventProcessed(false);
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
      
      if (updatedGameState.playerMoney < 100) {
        setGameState({
          ...updatedGameState,
          playerMoney: 0
        });
        setGameEnded(true);
      } else {
        setGameState(updatedGameState);
      }
      
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
  
  if (!gameState) return null;
  
  if (gameEnded) {
    return (
      <GameEndScreen 
        gameState={gameState} 
        onResetGame={onResetGame} 
      />
    );
  }
  
  const allHorses = [
    gameState.playerHorse,
    ...gameState.competitors
  ].filter(horse => !horse.missNextRace);
  
  const selectedHorse = allHorses.find(h => h.id === selectedHorseId) || null;
  
  return (
    <div className="min-h-screen bg-racing-beige pb-10 relative">
      <GameHeader 
        currentRace={gameState.currentRace}
        totalRaces={gameState.totalRaces}
        playerMoney={gameState.playerMoney}
        seasonGoal={gameState.seasonGoal}
      />
      
      <main className="container mx-auto p-4">
        {!eventProcessed && currentEvent && (
          <div className="mb-6">
            <RandomEventHandler 
              event={currentEvent}
              onAcceptEvent={handleAcceptEvent}
              onDismissEvent={handleDismissEvent}
              playerMoney={gameState.playerMoney}
              isPendingPassiveEvent={pendingPassiveEvent}
            />
          </div>
        )}
        
        <GameProgress 
          currentRace={gameState.currentRace}
          totalRaces={gameState.totalRaces}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <HorseManagement 
              playerHorse={gameState.playerHorse}
              currentRace={gameState.currentRace}
              onScout={handleScout}
              onTakeLoan={handleTakeLoan}
              scoutCosts={SCOUTING_COSTS}
              isDisabled={raceInProgress}
              playerMoney={gameState.playerMoney}
              loanAmount={gameState.loanAmount}
              hasUsedLoanThisRace={gameState.hasUsedLoanThisRace}
            />
          </div>
          
          <CompetitorsPanel 
            competitors={gameState.competitors}
            playerHorse={gameState.playerHorse}
            currentRace={gameState.currentRace}
            selectedHorseId={selectedHorseId}
            onSelectHorse={setSelectedHorseId}
            onScout={handleScout}
            onSelectTraining={handleTrainingSelection}
            trainingsUsed={gameState.trainingsUsed}
            isTrainingDisabled={trainingSelected || raceInProgress}
            scoutCosts={SCOUTING_COSTS}
            isDisabled={raceInProgress || betPlaced}
            playerMoney={gameState.playerMoney}
            seasonResults={seasonResults}
          />
          
          <BettingAndRacePanel 
            selectedHorseId={selectedHorseId}
            horses={allHorses}
            onPlaceBet={handlePlaceBet}
            playerMoney={gameState.playerMoney}
            currentRace={gameState.currentRace}
            onStartRace={handleStartRace}
            raceInProgress={raceInProgress}
            raceResults={gameState.raceResults}
            playerHorseId={gameState.playerHorse.id}
            onViewResults={() => setShowingResults(true)}
            onBetAmountChange={handleBetAmountChange}
            onSelectHorse={setSelectedHorseId}
          />
        </div>
      </main>
      
      {raceInProgress && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center animate-pulse max-w-md mx-4">
            <div className="text-2xl font-bold mb-4 animate-gallop">
              {t("race.progress")}
            </div>
            <p className="text-lg text-muted-foreground">
              {t("race.description")}
            </p>
          </div>
        </div>
      )}
      
      <RaceResults 
        isOpen={showingResults}
        onClose={handleCloseResults}
        results={gameState.raceResults}
        playerHorseId={gameState.playerHorse.id}
        betHorseId={gameState.lastBet?.horseId || null}
      />
      
      <BetWarningDialog 
        isOpen={showBetWarning}
        onClose={() => setShowBetWarning(false)}
        onPlaceBet={handlePlaceBet}
        onContinueWithoutBet={startRaceSequence}
        selectedHorse={selectedHorse}
        playerMoney={gameState.playerMoney}
        initialBetAmount={currentBetAmount}
      />
    </div>
  );
};

export default GameContainer;
