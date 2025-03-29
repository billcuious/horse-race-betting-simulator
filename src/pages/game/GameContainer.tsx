
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
  onResetGame
}: {
  playerName: string;
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
  
  // Initialize game on component mount
  useEffect(() => {
    const newGame = initializeGame(playerName || "Player");
    setGameState(newGame);
    setCurrentEvent(getRandomEvent());
  }, [playerName]);
  
  // Function to handle training selection
  const handleTrainingSelection = (type: "general" | "speed" | "rest" | "sync") => {
    if (!gameState) return;
    
    const updatedGameState = applyTraining(gameState, type);
    setGameState(updatedGameState);
    setTrainingSelected(true);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} training applied!`);
  };
  
  // Function to handle scouting
  const handleScout = (horseId: string, type: "basic" | "deep") => {
    if (!gameState) return;
    
    if (horseId === gameState.playerHorse.id) {
      // Scouting own horse
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
      // Scouting competitor
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
  
  // Function to handle taking a loan
  const handleTakeLoan = () => {
    if (!gameState) return;
    
    const updatedGameState = takeLoan(gameState);
    const loanAmount = calculateLoanAmount(gameState.playerMoney);
    
    setGameState(updatedGameState);
    toast.success(`Loan of $${loanAmount} received!`);
  };
  
  // Function to handle placing a bet
  const handlePlaceBet = (horseId: string, amount: number) => {
    if (!gameState) return;
    
    // Check if bet would make player go broke
    if (gameState.playerMoney - amount < 100) {
      toast.error("You need to maintain at least $100 after betting!");
      return;
    }
    
    // Update last bet
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
  
  // Function to start the race
  const handleStartRace = () => {
    if (!gameState) return;
    
    // Check if a horse is selected but no bet placed
    if (selectedHorseId && !betPlaced) {
      setShowBetWarning(true);
      return;
    }
    
    startRaceSequence();
  };
  
  // Function to start race after confirming no bet
  const startRaceSequence = () => {
    if (!gameState) return;
    
    setRaceInProgress(true);
    
    // Simulate the racing process with a slight delay
    setTimeout(() => {
      const raceResults = simulateRace(gameState);
      // Update all horses after the race based on their recovery and endurance
      const updatedGameState = updateHorsesAfterRace(raceResults);
      
      // Store race results for season history
      setSeasonResults(prev => [
        ...prev, 
        { 
          raceNumber: gameState.currentRace, 
          results: updatedGameState.raceResults 
        }
      ]);
      
      // Check if player went broke (has less than $100)
      if (updatedGameState.playerMoney < 100) {
        setGameState({
          ...updatedGameState,
          playerMoney: 0 // Set to 0 to avoid negative display
        });
        setGameEnded(true);
      } else {
        setGameState(updatedGameState);
      }
      
      setRaceInProgress(false);
      setShowingResults(true);
      
      // Reset for next race
      setTrainingSelected(false);
      setBetPlaced(false);
      setSelectedHorseId(null);
      
      // Check if game is over
      if (isGameOver(updatedGameState) || updatedGameState.playerMoney < 100) {
        setGameEnded(true);
      } else {
        // Generate new random event for the next race
        setCurrentEvent(getRandomEvent());
        setEventProcessed(false);
      }
    }, 3000);
  };
  
  // Function to close the results dialog
  const handleCloseResults = () => {
    setShowingResults(false);
  };
  
  // Function to accept a random event
  const handleAcceptEvent = () => {
    if (!gameState || !currentEvent) return;
    
    if (currentEvent.type === "passive") {
      // Apply passive event
      const updatedGameState = applyRandomEvent(gameState, currentEvent);
      
      // Check if player went broke after event
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
      // Apply choice event effect
      const { gameState: updatedGameState, message } = currentEvent.acceptEffect(gameState);
      
      // Check if player went broke after event
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
  
  // Function to dismiss an event
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
  
  // Include all horses for betting, including player's horse
  const allHorses = [
    gameState.playerHorse,
    ...gameState.competitors
  ].filter(horse => !horse.missNextRace);
  
  // Find selected horse for the bet warning dialog
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
        {/* Show random event if not processed */}
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
          {/* Left Column - Your Horse & Training */}
          <div className="space-y-6">
            <HorseManagement 
              playerHorse={gameState.playerHorse}
              currentRace={gameState.currentRace}
              onScout={handleScout}
              onSelectTraining={handleTrainingSelection}
              trainingsUsed={gameState.trainingsUsed}
              onTakeLoan={handleTakeLoan}
              scoutCosts={SCOUTING_COSTS}
              isTrainingDisabled={trainingSelected || raceInProgress}
              isDisabled={raceInProgress}
              playerMoney={gameState.playerMoney}
              loanAmount={gameState.loanAmount}
            />
          </div>
          
          {/* Middle Column - Competitors */}
          <CompetitorsPanel 
            competitors={gameState.competitors}
            playerHorse={gameState.playerHorse}
            currentRace={gameState.currentRace}
            selectedHorseId={selectedHorseId}
            onSelectHorse={setSelectedHorseId}
            onScout={handleScout}
            scoutCosts={SCOUTING_COSTS}
            isDisabled={raceInProgress || betPlaced}
            playerMoney={gameState.playerMoney}
            seasonResults={seasonResults}
          />
          
          {/* Right Column - Betting & Race */}
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
      
      {/* Centered Race Progress Overlay */}
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
      
      {/* Race Results Dialog */}
      <RaceResults 
        isOpen={showingResults}
        onClose={handleCloseResults}
        results={gameState.raceResults}
        playerHorseId={gameState.playerHorse.id}
        betHorseId={gameState.lastBet?.horseId || null}
      />
      
      {/* Bet Warning Dialog */}
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
