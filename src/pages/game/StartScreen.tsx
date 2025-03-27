
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStartGame: (playerName: string) => void;
}

const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const [playerName, setPlayerName] = useState<string>("");
  
  const handleStartGame = () => {
    onStartGame(playerName.trim() || "Player");
  };
  
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
          <Button className="w-full" onClick={handleStartGame}>
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartScreen;
