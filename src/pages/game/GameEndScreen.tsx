
import { GameState, isGameWon } from "@/utils/gameLogic";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface GameEndScreenProps {
  gameState: GameState;
  onResetGame: () => void;
}

const GameEndScreen = ({ gameState, onResetGame }: GameEndScreenProps) => {
  const goalReached = isGameWon(gameState);
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-racing-beige p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-end mb-2">
            <LanguageSelector />
          </div>
          <CardTitle className={`text-3xl font-bold ${goalReached ? 'text-racing-gold' : 'text-racing-red'}`}>
            {t("end.seasonOver")}
          </CardTitle>
          <CardDescription>
            {goalReached 
              ? t("end.win")
              : t("end.lose")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <CoinsIcon className={`h-6 w-6 ${goalReached ? 'text-racing-gold' : 'text-muted-foreground'}`} />
              <span>${gameState.playerMoney.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("header.goal")}: ${gameState.seasonGoal.toLocaleString()}
            </p>
            
            {gameState.loanAmount > 0 && (
              <div className="mt-4 p-2 border rounded bg-red-50">
                <p className="text-sm font-medium text-red-500">
                  {t("end.loan")} ${gameState.loanAmount.toLocaleString()}
                </p>
                <p className="text-xs text-red-400">
                  {t("end.netWorth")} ${Math.max(0, gameState.playerMoney - (gameState.loanAmount * 1.25)).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <h3 className="font-medium mb-2">{t("end.finalStats")}</h3>
            <ul className="space-y-1">
              <li>{t("stats.speed")}: {gameState.playerHorse.displayedSpeed}</li>
              <li>{t("stats.control")}: {gameState.playerHorse.control}</li>
              <li>{t("stats.recovery")}: {gameState.playerHorse.recovery}</li>
              <li>{t("stats.endurance")}: {gameState.playerHorse.endurance}</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={onResetGame}>
            {t("end.playAgain")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameEndScreen;
