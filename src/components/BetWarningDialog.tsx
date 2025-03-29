
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Horse } from "@/utils/gameLogic";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Coins } from "lucide-react";

interface BetWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceBet: (horseId: string, amount: number) => void;
  onContinueWithoutBet: () => void;
  selectedHorse: Horse | null;
  playerMoney: number;
}

const BetWarningDialog = ({ 
  isOpen, 
  onClose, 
  onPlaceBet, 
  onContinueWithoutBet,
  selectedHorse,
  playerMoney
}: BetWarningDialogProps) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  
  const handlePlaceBet = () => {
    if (selectedHorse && betAmount > 0) {
      onPlaceBet(selectedHorse.id, betAmount);
      onClose();
    }
  };
  
  const handleContinue = () => {
    onContinueWithoutBet();
    onClose();
  };
  
  const maxBet = Math.max(0, playerMoney - 100); // Keep at least $100
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>No Bet Placed</DialogTitle>
          </div>
          <DialogDescription>
            You've selected {selectedHorse?.name} but haven't placed a bet yet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span>Would you like to place a bet before the race starts?</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={100}
              max={maxBet}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-muted-foreground whitespace-nowrap">Max: ${maxBet}</span>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleContinue}
            className="w-full sm:w-auto"
          >
            Continue Without Betting
          </Button>
          <Button 
            onClick={handlePlaceBet}
            disabled={!selectedHorse || betAmount <= 0 || betAmount > maxBet}
            className="w-full sm:w-auto"
          >
            Place Bet & Start Race
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BetWarningDialog;
