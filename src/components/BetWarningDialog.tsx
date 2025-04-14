
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Horse } from "@/utils/gameLogic";

interface BetWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceBet: (horseId: string, amount: number) => void;
  onContinueWithoutBet: () => void;
  selectedHorse: Horse | null;
  playerMoney: number;
  initialBetAmount?: number;
}

const BetWarningDialog = ({
  isOpen,
  onClose,
  onPlaceBet,
  onContinueWithoutBet,
  selectedHorse,
  playerMoney,
  initialBetAmount = 100,
}: BetWarningDialogProps) => {
  const [betAmount, setBetAmount] = useState(initialBetAmount);
  const { t } = useLanguage();
  
  // Update betAmount when initialBetAmount changes
  useEffect(() => {
    if (initialBetAmount !== 100) {
      setBetAmount(initialBetAmount);
    }
  }, [initialBetAmount]);

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

  const handlePlaceBet = () => {
    if (selectedHorse) {
      onPlaceBet(selectedHorse.id, betAmount);
      onClose();
    }
  };

  const handleContinueWithoutBet = () => {
    onContinueWithoutBet();
    onClose(); // Make sure to close the dialog when continuing without bet
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("betWarning.title")}</DialogTitle>
          <DialogDescription>
            {selectedHorse
              ? t("betWarning.description").replace("{{horseName}}", selectedHorse.name)
              : ""}
            <p className="mt-2">{t("betWarning.question")}</p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => decreaseBet(100)}
              disabled={betAmount <= 100}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min={100}
              max={playerMoney}
              value={betAmount}
              onChange={(e) => handleManualInput(e.target.value)}
              className="text-center"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => increaseBet(100)}
              disabled={betAmount + 100 > playerMoney}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              {t("betWarning.max")} ${playerMoney}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => increaseBet(1000)}
              disabled={betAmount + 1000 > playerMoney}
            >
              +$1,000
            </Button>
            <Button
              variant="outline"
              onClick={() => decreaseBet(1000)}
              disabled={betAmount - 1000 < 100}
            >
              -$1,000
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleContinueWithoutBet}
          >
            {t("betWarning.continue")}
          </Button>
          <Button type="button" onClick={handlePlaceBet}>
            {t("betWarning.placeBet")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BetWarningDialog;
