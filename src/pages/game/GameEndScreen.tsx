
import { GameState, isGameWon } from "@/utils/gameLogic";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";

interface GameEndScreenProps {
  gameState: GameState;
  onResetGame: () => void;
}

const GameEndScreen = ({ gameState, onResetGame }: GameEndScreenProps) => {
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
              <CoinsIcon className={`h-6 w-6 ${goalReached ? 'text-racing-gold' : 'text-muted-foreground'}`} />
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
                  Net Worth: ${Math.max(0, gameState.playerMoney - (gameState.loanAmount * 1.25)).toLocaleString()}
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
          <Button className="w-full" onClick={onResetGame}>
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameEndScreen;
