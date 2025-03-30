
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import HorseCard from "@/components/HorseCard";
import { Horse, calculateLoanAmount } from "@/utils/gameLogic";
import { InfoIcon } from "lucide-react";

interface HorseManagementProps {
  playerHorse: Horse;
  currentRace: number;
  onScout: (horseId: string, type: "basic" | "deep") => void;
  onTakeLoan: () => void;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  isDisabled: boolean;
  playerMoney: number;
  loanAmount: number;
}

const HorseManagement = ({
  playerHorse,
  currentRace,
  onScout,
  onTakeLoan,
  scoutCosts,
  isDisabled,
  playerMoney,
  loanAmount
}: HorseManagementProps) => {
  const availableLoan = calculateLoanAmount(playerMoney);
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Horse</CardTitle>
          <CardDescription>
            Manage and train your horse before each race
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HorseCard 
            horse={playerHorse}
            currentRace={currentRace}
            onScout={onScout}
            scoutCosts={scoutCosts}
            isDisabled={isDisabled}
            playerMoney={playerMoney}
            isPlayerHorse={true}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Financial Options</CardTitle>
          <CardDescription>Take a loan if you're short on cash</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant="outline" disabled={isDisabled}>
                  Take Loan (${availableLoan})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Loan</AlertDialogTitle>
                  <AlertDialogDescription>
                    You're about to take a loan of ${availableLoan}. This will need to be repaid at the end of the season. Proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onTakeLoan}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {loanAmount > 0 && (
              <div className="text-sm text-muted-foreground text-center">
                Current debt: ${loanAmount}
              </div>
            )}
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center justify-center text-sm text-muted-foreground cursor-help">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  <span>How do loans work?</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Loan Information</h4>
                  <p className="text-sm">
                    You can take a loan to get more money for betting and training. The loan amount is based on your current money.
                  </p>
                  <p className="text-sm">
                    The total loan amount will be deducted from your final money at the end of the season.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HorseManagement;
