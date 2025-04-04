
import { useState, useEffect } from "react";
import GameHeader from "./components/GameHeader";
import GameProgress from "./components/GameProgress";
import RandomEventHandler from "./components/RandomEventHandler";
import HorseManagement from "./components/HorseManagement";
import CompetitorsPanel from "./components/CompetitorsPanel";
import BettingAndRacePanel from "./components/BettingAndRacePanel";
import RaceResults from "@/components/RaceResults";
import GameEndScreen from "./GameEndScreen";
import BetWarningDialog from "@/components/BetWarningDialog";
import RaceInProgress from "./components/RaceInProgress";
import { 
  GameState,
  SCOUTING_COSTS
} from "@/utils/gameLogic";
import { useGameState } from "@/hooks/useGameState";
import { useGameActions } from "@/hooks/useGameActions";

const GameContainer = ({
  playerName,
  jockeyId,
  onResetGame
}: {
  playerName: string;
  jockeyId: string;
  onResetGame: () => void;
}) => {
  const {
    gameState,
    setGameState,
    currentEvent,
    setCurrentEvent,
    pendingPassiveEvent,
    setPendingPassiveEvent,
    eventProcessed,
    setEventProcessed,
    gameEnded,
    seasonResults,
    addRaceResults,
    resetEventState,
    setNextEvent
  } = useGameState(playerName, jockeyId);

  const {
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
  } = useGameActions(
    gameState,
    setGameState,
    addRaceResults,
    currentEvent,
    pendingPassiveEvent,
    setCurrentEvent,
    setEventProcessed,
    resetEventState,
    setNextEvent
  );
  
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
          />
        </div>
      </main>
      
      {raceInProgress && (
        <RaceInProgress />
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
