
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CoinIcon, TrophyIcon, InfoIcon } from "lucide-react";
import HorseCard from "@/components/HorseCard";
import TrainingOptions from "@/components/TrainingOptions";
import BettingPanel from "@/components/BettingPanel";
import RaceResults from "@/components/RaceResults";
import EventPanel from "@/components/EventPanel";
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
  isGameWon
} from "@/utils/gameLogic";

const Index = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [trainingSelected, setTrainingSelected] = useState<boolean>(false);
  const [showingResults, setShowingResults] = useState<boolean>(false);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventProcessed, setEventProcessed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  
  // Function to start a new game
  const startGame = () => {
    if (!playerName.trim()) {
      setPlayerName("Player");
    }
    
    const newGame = initializeGame(playerName || "Player");
    setGameState(newGame);
    setGameStarted(true);
    setTrainingSelected(false);
    setBetPlaced(false);
    setRaceInProgress(false);
    setShowingResults(false);
    setEventProcessed(false);
    setGameEnded(false);
    
    // Generate the first random event
    setCurrentEvent(getRandomEvent());
  };
  
  // Function to reset the game
  const resetGame = () => {
    setGameState(null);
    setGameStarted(false);
    setSelectedHorseId(null);
    setTrainingSelected(false);
    setBetPlaced(false);
    setRaceInProgress(false);
    setShowingResults(false);
    setCurrentEvent(null);
    setEventProcessed(false);
    setGameEnded(false);
  };
  
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
    
    setRaceInProgress(true);
    
    // Simulate the racing process with a slight delay
    setTimeout(() => {
      const updatedGameState = simulateRace(gameState);
      setGameState(updatedGameState);
      setRaceInProgress(false);
      setShowingResults(true);
      
      // Reset for next race
      setTrainingSelected(false);
      setBetPlaced(false);
      setSelectedHorseId(null);
      
      // Check if game is over
      if (isGameOver(updatedGameState)) {
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
      setGameState(updatedGameState);
      
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
      setGameState(updatedGameState);
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
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-racing-beige p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-racing-green">Horse Racing Simulator</CardTitle>
            <CardDescription>Bet, train, and race your way to victory!</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Enter your name:</label>
              <input
                type="text"
                placeholder="Owner Name"
                className="w-full p-2 border rounded"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
            
            <div className="rounded-md bg-muted p-4 text-sm">
              <h3 className="font-medium mb-2">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Train your horse and scout competitors</li>
                <li>Bet on races to earn money</li>
                <li>Your goal is to reach the season target money</li>
                <li>The season consists of {15} races</li>
                <li>You can take loans if needed</li>
                <li>Each horse has unique stats and hidden traits</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full" onClick={startGame}>
              Start Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!gameState) return null;
  
  if (gameEnded) {
    const goalReached = isGameWon(gameState);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-racing-beige p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className={`text-3xl font-bold ${goalReached ? 'text-racing-gold' : 'text-racing-red'}`}>
              Season Over!
            </CardTitle>
            <CardDescription>
              {goalReached 
                ? "Congratulations! You've reached your financial goal!" 
                : "Better luck next season. You didn't reach your financial goal."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <CoinIcon className={`h-6 w-6 ${goalReached ? 'text-racing-gold' : 'text-muted-foreground'}`} />
                <span>${gameState.playerMoney.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Goal: ${gameState.seasonGoal.toLocaleString()}
              </p>
              
              {gameState.loanAmount > 0 && (
                <div className="mt-4 p-2 border rounded bg-red-50">
                  <p className="text-sm font-medium text-red-500">
                    Outstanding Loan: ${gameState.loanAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-400">
                    Net Worth: ${(gameState.playerMoney - (gameState.loanAmount * 1.25)).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="rounded-md bg-muted p-4 text-sm">
              <h3 className="font-medium mb-2">Final Horse Stats:</h3>
              <ul className="space-y-1">
                <li>Speed: {gameState.playerHorse.displayedSpeed}</li>
                <li>Control: {gameState.playerHorse.control}</li>
                <li>Recovery: {gameState.playerHorse.recovery}</li>
                <li>Endurance: {gameState.playerHorse.endurance}</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={resetGame}>
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Filter out horses that are missing the next race
  const availableHorses = [
    gameState.playerHorse,
    ...gameState.competitors
  ].filter(horse => !horse.missNextRace);
  
  return (
    <div className="min-h-screen bg-racing-beige pb-10">
      {/* Header */}
      <header className="bg-racing-green text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Horse Racing Simulator</h1>
            <p className="text-sm opacity-80">Season {gameState.currentRace} of {gameState.totalRaces}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-80">Money</p>
              <p className="font-bold">${gameState.playerMoney.toLocaleString()}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm opacity-80">Goal</p>
              <p className="font-bold">${gameState.seasonGoal.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Show random event if not processed */}
        {!eventProcessed && currentEvent && (
          <div className="mb-6">
            <EventPanel 
              event={currentEvent}
              onAcceptEvent={handleAcceptEvent}
              onDismissEvent={handleDismissEvent}
              playerMoney={gameState.playerMoney}
            />
          </div>
        )}
        
        {/* Season Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Season Progress</h2>
            <span className="text-sm">
              Race {gameState.currentRace} of {gameState.totalRaces}
            </span>
          </div>
          <Progress value={(gameState.currentRace - 1) / gameState.totalRaces * 100} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Your Horse & Training */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Horse</CardTitle>
                <CardDescription>
                  {gameState.playerHorse.name}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <HorseCard 
                  horse={gameState.playerHorse}
                  currentRace={gameState.currentRace}
                  isPlayerHorse={true}
                  onScout={handleScout}
                  scoutCosts={SCOUTING_COSTS}
                  isDisabled={raceInProgress}
                  playerMoney={gameState.playerMoney}
                />
              </CardContent>
            </Card>
            
            {/* Training Options */}
            <TrainingOptions 
              onSelectTraining={handleTrainingSelection}
              trainingsUsed={gameState.trainingsUsed}
              playerMoney={gameState.playerMoney}
              isDisabled={trainingSelected || raceInProgress}
            />
            
            {/* Loan Options */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Financial Options</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                {gameState.loanAmount > 0 && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm font-semibold">Outstanding Loan</p>
                    <p className="text-lg font-bold text-red-500">${gameState.loanAmount}</p>
                    <p className="text-xs text-muted-foreground">
                      Must repay ${Math.round(gameState.loanAmount * 1.25)} at end of season
                    </p>
                  </div>
                )}
                
                <div className="mb-2">
                  <p className="text-sm mb-1">Available Loan Amount</p>
                  <p className="font-medium">${calculateLoanAmount(gameState.playerMoney)}</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={raceInProgress}
                    >
                      Take Loan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Loan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Take a loan of ${calculateLoanAmount(gameState.playerMoney)}? You'll need to repay with 25% interest at the end of the season.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleTakeLoan}>
                        Accept Loan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
          
          {/* Middle Column - Competitors */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Competitors</CardTitle>
                <CardDescription>
                  Scout horses to get updated information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2">
                  {gameState.competitors.map((horse) => (
                    <HorseCard 
                      key={horse.id}
                      horse={horse}
                      currentRace={gameState.currentRace}
                      onScout={handleScout}
                      onSelect={setSelectedHorseId}
                      isSelected={selectedHorseId === horse.id}
                      scoutCosts={SCOUTING_COSTS}
                      isDisabled={raceInProgress || betPlaced}
                      playerMoney={gameState.playerMoney}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Betting & Race */}
          <div className="space-y-6">
            {/* Betting Panel */}
            <BettingPanel 
              selectedHorseId={selectedHorseId}
              horses={availableHorses}
              onPlaceBet={handlePlaceBet}
              playerMoney={gameState.playerMoney}
              currentRace={gameState.currentRace}
              onStartRace={handleStartRace}
              betInProgress={raceInProgress}
            />
            
            {/* Race Status */}
            {raceInProgress && (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-lg font-bold mb-2 animate-gallop">
                      Race in Progress...
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hold your breath!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Previous Race Result Summary */}
            {gameState.raceResults.length > 0 && !raceInProgress && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Latest Results</CardTitle>
                  <CardDescription>
                    Race {gameState.currentRace - 1}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {gameState.raceResults
                      .sort((a, b) => a.position - b.position)
                      .slice(0, 3)
                      .map((result) => {
                        const isPlayerHorse = result.horseId === gameState.playerHorse.id;
                        return (
                          <div 
                            key={result.horseId}
                            className={`p-2 border rounded-md flex items-center ${
                              isPlayerHorse ? "bg-muted/40" : ""
                            }`}
                          >
                            <div className="w-8 text-center font-bold">
                              {result.position === 1 && (
                                <Badge className="bg-racing-gold">1st</Badge>
                              )}
                              {result.position === 2 && (
                                <Badge variant="outline">2nd</Badge>
                              )}
                              {result.position === 3 && (
                                <Badge variant="outline">3rd</Badge>
                              )}
                            </div>
                            <div className="ml-2">
                              {result.horseName}
                              {isPlayerHorse && (
                                <span className="text-xs ml-1 text-muted-foreground">(You)</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowingResults(true)}
                  >
                    View Full Results
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      {/* Race Results Dialog */}
      <RaceResults 
        isOpen={showingResults}
        onClose={handleCloseResults}
        results={gameState.raceResults}
        playerHorseId={gameState.playerHorse.id}
      />
    </div>
  );
};

export default Index;
