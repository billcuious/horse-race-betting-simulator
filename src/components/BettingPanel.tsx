
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Horse } from "@/utils/gameLogic";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getVisibleHorseStats } from "@/utils/horsesData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BettingPanelProps {
  selectedHorseId: string | null;
  horses: Horse[];
  onPlaceBet: (horseId: string, amount: number) => void;
  playerMoney: number;
  currentRace: number;
  onStartRace: () => void;
  betInProgress: boolean;
  onBetAmountChange?: (amount: number) => void;
  onSelectHorse?: (horseId: string | null) => void;
  playerHorseId?: string; // Add this prop, making it optional with ?
}

const BettingPanel = ({
  selectedHorseId,
  horses,
  onPlaceBet,
  playerMoney,
  currentRace,
  onStartRace,
  betInProgress,
  onBetAmountChange,
  onSelectHorse,
  playerHorseId = "" // Provide default empty string
}: BettingPanelProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const selectedHorse = horses.find(h => h.id === selectedHorseId);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (onBetAmountChange) {
      onBetAmountChange(betAmount);
    }
  }, [betAmount, onBetAmountChange]);
  
  const increaseBet = (amount: number) => {
    if (betAmount + amount <= playerMoney) {
      setBetAmount(prev => prev + amount);
    }
  };
  
  const decreaseBet = (amount: number) => {
    if (betAmount - amount >= 100) {
      setBetAmount(prev => prev - amount);
    }
  };
  
  const handleManualInput = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue < 100) {
        setBetAmount(100);
      } else if (numValue > playerMoney) {
        setBetAmount(playerMoney);
      } else {
        setBetAmount(numValue);
      }
    }
  };

  const handleHorseSelect = (value: string) => {
    if (onSelectHorse) {
      onSelectHorse(value);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{t("betting.title")}</CardTitle>
        <CardDescription>{t("betting.selectDescription").replace("{{race}}", currentRace.toString())}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{t("betting.selectedHorse")}</h3>
          
          <Select value={selectedHorseId || ""} onValueChange={handleHorseSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("betting.noSelection")} />
            </SelectTrigger>
            <SelectContent>
              {horses.map((horse) => (
                <SelectItem key={horse.id} value={horse.id} disabled={horse.missNextRace || betInProgress}>
                  {horse.name}
                  {horse.id === playerHorseId ? ` (${t("results.you")})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedHorse && (
            <div className="mt-2 p-3 border rounded-md">
              <div className="flex gap-2 mt-1 text-sm">
                <span>{t("stats.speed")}: {getVisibleHorseStats(selectedHorse, currentRace).displayedSpeed}</span>
                <span>•</span>
                <span>{t("stats.control")}: {getVisibleHorseStats(selectedHorse, currentRace).control}</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium mb-2">{t("betting.amount")}: ${betAmount}</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => decreaseBet(100)}
              disabled={betAmount <= 100 || betInProgress}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              min={100}
              max={playerMoney}
              value={betAmount}
              onChange={(e) => handleManualInput(e.target.value)}
              disabled={betInProgress}
              className="text-center"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => increaseBet(100)}
              disabled={betAmount + 100 > playerMoney || betInProgress}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="outline" 
              onClick={() => increaseBet(1000)}
              disabled={betAmount + 1000 > playerMoney || betInProgress}
            >
              +$1,000
            </Button>
            <Button 
              variant="outline" 
              onClick={() => decreaseBet(1000)}
              disabled={betAmount - 1000 < 100 || betInProgress}
            >
              -$1,000
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={!selectedHorseId || betInProgress}
            >
              {t("betting.place")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("betting.confirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedHorse 
                  ? t("betting.confirmDescription").replace("{{amount}}", betAmount.toString()).replace("{{horse}}", selectedHorse.name)
                  : t("betting.noSelection")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedHorseId && onPlaceBet(selectedHorseId, betAmount)}
              >
                {t("action.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          variant="default" 
          className="w-full" 
          onClick={onStartRace}
          disabled={betInProgress}
        >
          {t("betting.start")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BettingPanel;
