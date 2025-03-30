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
  updateHorsesAfterRace,
  RaceResult
} from "@/utils/gameLogic";

const GameContainer = ({
  playerName,
  jockeyId,
  onResetGame
}: {
  playerName: string;
  jockeyId: string;
  onResetGame: () => void;
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [trainingSelected, setTrainingSelected] = useState<boolean>(false);
  const [showingResults, setShowingResults] = useState<boolean>(false);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventProcessed, setEventProcessed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [seasonResults, setSeasonResults] = useState<{raceNumber: number; results: RaceResult[]}[]>([]);
  const [showBetWarning, setShowBetWarning] = useState<boolean>(false);
  
  useEffect(() => {
    const newGame = initializeGame(playerName || "Player", jockeyId);
    setGameState(newGame);
    setCurrentEvent(getRandomEvent());
  }, [playerName, jockeyId]);
  
  const handleTrainingSelection = (type: "general" | "speed" | "rest" | "sync") => {
    if (!gameState) return;
    
    const updatedGameState = applyTraining(gameState, type);
    setGameState(updatedGameState);
    setTrainingSelected(true);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} training applied!`);
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
        toast.success(`Discovered trait: ${revealedTrait}`);
      } else {
        toast.info("No new traits discovered");
      }
    } else {
      const updatedGameState = scoutHorse(gameState, horseId, type);
      setGameState(updatedGameState);
      
      const horse = updatedGameState.competitors.find(h => h.id === horseId);
      if (!horse) return;
      
      if (type === "deep") {
        const revealedTrait = horse.revealedAttributes[horse.revealedAttributes.length - 1]?.name;
        
        if (revealedTrait) {
          toast.success(`Discovered trait on ${horse.name}: ${revealedTrait}`);
        } else {
          toast.info(`No new traits discovered on ${horse.name}`);
        }
      } else {
        toast.success(`Updated stats for ${horse.name}`);
      }
    }
  };
  
  const handleTakeLoan = () => {
    if (!gameState) return;
    
    const updatedGameState = takeLoan(gameState);
    const loanAmount = calculateLoanAmount(gameState.playerMoney);
    
    setGameState(updatedGameState);
    toast.success(`Loan of $${loanAmount} received!`);
  };
  
  const handlePlaceBet = (horseId: string, amount: number) => {
    if (!gameState) return;
    
    if (gameState.playerMoney - amount < 100) {
      toast.error("You need to maintain at least $100 after betting!");
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
    toast.success(`Bet $${amount} on ${horse?.name}`);
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
      const updatedGameState = updateHorsesAfterRace(raceResults);
      
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
      } else {
        setGameState(updatedGameState);
      }
      
      setRaceInProgress(false);
      setShowingResults(true);
      
      setTrainingSelected(false);
      setBetPlaced(false);
      setSelectedHorseId(null);
      
      if (isGameOver(updatedGameState) || updatedGameState.playerMoney < 100) {
        setGameEnded(true);
      } else {
        setCurrentEvent(getRandomEvent());
        setEventProcessed(false);
      }
    }, 3000);
  };
  
  const handleCloseResults = () => {
    setShowingResults(false);
  };
  
  const handleAcceptEvent = () => {
    if (!gameState || !currentEvent) return;
    
    if (currentEvent.type === "passive") {
      const updatedGameState = applyRandomEvent(gameState, currentEvent);
      
      if (updatedGameState.playerMoney < 100) {
        setGameState({
          ...updatedGameState,
          playerMoney: 0
        });
        setGameEnded(true);
      } else {
        setGameState(updatedGameState);
      }
      
      if (currentEvent.moneyEffect) {
        if (currentEvent.moneyEffect > 0) {
          toast.success(`Event: ${currentEvent.title}! +$${currentEvent.moneyEffect}`);
        } else {
          toast.error(`Event: ${currentEvent.title}! ${currentEvent.moneyEffect}`);
        }
      }
    } else if (currentEvent.type === "choice" && currentEvent.acceptEffect) {
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
      
      toast.success(`Event: ${message}`);
    }
    
    setCurrentEvent(null);
    setEventProcessed(true);
  };
  
  const handleDismissEvent = () => {
    setCurrentEvent(null);
    setEventProcessed(true);
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
          />
        </div>
      </main>
      
      {raceInProgress && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center animate-pulse max-w-md mx-4">
            <div className="text-2xl font-bold mb-4 animate-gallop">
              Race in Progress...
            </div>
            <p className="text-lg text-muted-foreground">
              The horses are thundering down the track!
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
      />
    </div>
  );
};

export default GameContainer;
