
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Horse } from "@/utils/gameLogic";
import { formatCurrency } from "@/utils/formatters";

interface BettingPanelProps {
  selectedHorseId: string | null;
  horses: Horse[];
  onPlaceBet: (horseId: string, amount: number) => void;
  playerMoney: number;
  currentRace: number;
  onStartRace: () => void;
  betInProgress: boolean;
  odds?: number;
}

const BettingPanel = ({
  selectedHorseId,
  horses,
  onPlaceBet,
  playerMoney,
  currentRace,
  onStartRace,
  betInProgress,
  odds = 2.0
}: BettingPanelProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  
  // Get selected horse name
  const selectedHorse = horses.find(h => h.id === selectedHorseId);
  const horseName = selectedHorse?.name || "No horse selected";
  
  // Update potential winnings when bet amount or odds change
  useEffect(() => {
    if (selectedHorseId) {
      setPotentialWinnings(Math.floor(betAmount * odds));
    } else {
      setPotentialWinnings(0);
    }
  }, [betAmount, selectedHorseId, odds]);
  
  // Handle bet amount change from slider
  const handleSliderChange = (value: number[]) => {
    setBetAmount(value[0]);
  };
  
  // Handle bet amount change from input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= playerMoney) {
      setBetAmount(value);
    }
  };
  
  // Handle quick bet options
  const handleQuickBet = (percentage: number) => {
    const amount = Math.floor(playerMoney * (percentage / 100));
    setBetAmount(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Place Your Bet</span>
          <span className="text-sm font-normal">Race {currentRace}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-3 border rounded-md">
          <p className="text-sm mb-1 font-medium">Selected Horse:</p>
          <div className="flex justify-between items-center">
            <p className={`text-lg ${!selectedHorseId ? "text-muted-foreground" : ""}`}>
              {horseName}
            </p>
            {selectedHorseId && odds > 0 && (
              <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                {odds.toFixed(1)}x odds
              </span>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Bet Amount: ${betAmount}</span>
            <span className="text-sm text-muted-foreground">Balance: ${playerMoney}</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              className="text-xs h-7 px-1.5 flex-1" 
              onClick={() => handleQuickBet(5)}
              disabled={!selectedHorseId || betInProgress}
            >
              5%
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-7 px-1.5 flex-1" 
              onClick={() => handleQuickBet(10)}
              disabled={!selectedHorseId || betInProgress}
            >
              10%
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-7 px-1.5 flex-1" 
              onClick={() => handleQuickBet(25)}
              disabled={!selectedHorseId || betInProgress}
            >
              25%
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-7 px-1.5 flex-1" 
              onClick={() => handleQuickBet(50)}
              disabled={!selectedHorseId || betInProgress}
            >
              50%
            </Button>
            <Button 
              variant="outline" 
              className="text-xs h-7 px-1.5 flex-1" 
              onClick={() => handleQuickBet(100)}
              disabled={!selectedHorseId || betInProgress}
            >
              All
            </Button>
          </div>
          
          <div className="mb-4">
            <Slider
              value={[betAmount]}
              min={0}
              max={playerMoney}
              step={10}
              onValueChange={handleSliderChange}
              disabled={!selectedHorseId || betInProgress}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={betAmount}
              onChange={handleInputChange}
              className="w-24"
              disabled={!selectedHorseId || betInProgress}
            />
            <Button 
              onClick={() => onPlaceBet(selectedHorseId!, betAmount)} 
              disabled={!selectedHorseId || betAmount <= 0 || betInProgress}
              variant="secondary"
              className="flex-1"
            >
              Place Bet
            </Button>
          </div>
        </div>
        
        {selectedHorseId && (
          <div className="text-sm text-center mt-2">
            Potential Winnings: <span className="font-bold text-green-600">${potentialWinnings}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onStartRace}
          disabled={betInProgress}
        >
          {betInProgress ? "Race in Progress..." : "Start Race"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BettingPanel;
