
import { useState } from "react";
import StartScreen from "./game/StartScreen";
import GameContainer from "./game/GameContainer";

const Index = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedJockeyId, setSelectedJockeyId] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  // Function to start a new game
  const startGame = (name: string, jockeyId: string) => {
    setPlayerName(name);
    setSelectedJockeyId(jockeyId);
    setGameStarted(true);
  };
  
  // Function to reset the game
  const resetGame = () => {
    setGameStarted(false);
  };
  
  if (!gameStarted) {
    return <StartScreen onStartGame={startGame} />;
  }
  
  return (
    <GameContainer 
      playerName={playerName} 
      jockeyId={selectedJockeyId}
      onResetGame={resetGame} 
    />
  );
};

export default Index;
