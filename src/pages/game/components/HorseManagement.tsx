
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import HorseCard from "@/components/HorseCard";
import { Horse, calculateLoanAmount } from "@/utils/gameLogic";

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
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Horse</CardTitle>
          <CardDescription>
            {playerHorse.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <HorseCard 
            horse={playerHorse}
            currentRace={currentRace}
            isPlayerHorse={true}
            onScout={onScout}
            scoutCosts={scoutCosts}
            isDisabled={isDisabled}
            playerMoney={playerMoney}
          />
        </CardContent>
      </Card>
      
      {/* Loan Options */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Financial Options</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-2">
          {loanAmount > 0 && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-semibold">Outstanding Loan</p>
              <p className="text-lg font-bold text-red-500">${loanAmount}</p>
              <p className="text-xs text-muted-foreground">
                Must repay ${Math.round(loanAmount * 1.25)} at end of season
              </p>
            </div>
          )}
          
          <div className="mb-2">
            <p className="text-sm mb-1">Available Loan Amount</p>
            <p className="font-medium">${calculateLoanAmount(playerMoney)}</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isDisabled}
              >
                Take Loan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Loan</AlertDialogTitle>
                <AlertDialogDescription>
                  Take a loan of ${calculateLoanAmount(playerMoney)}? You'll need to repay with 25% interest at the end of the season.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onTakeLoan}>
                  Accept Loan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );
};

export default HorseManagement;
