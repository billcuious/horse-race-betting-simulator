
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import HorseCard from "@/components/HorseCard";
import { Horse, calculateLoanAmount } from "@/utils/gameLogic";
import { InfoIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("horse.yourHorse")}</CardTitle>
          <CardDescription>
            {t("horse.manage")}
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
          <CardTitle className="text-lg">{t("horse.financial")}</CardTitle>
          <CardDescription>{t("horse.takeLoan")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant="outline" disabled={isDisabled}>
                  {t("horse.loanButton")} (${availableLoan})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("horse.confirmLoan")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("horse.loanDescription").replace("{{amount}}", availableLoan.toString())}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={onTakeLoan}>{t("action.confirm")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {loanAmount > 0 && (
              <div className="text-sm text-muted-foreground text-center">
                {t("horse.currentDebt")} ${loanAmount}
              </div>
            )}
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center justify-center text-sm text-muted-foreground cursor-help">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  <span>{t("horse.loanInfo")}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">{t("horse.loanDetails")}</h4>
                  <p className="text-sm">
                    {t("horse.loanExplain1")}
                  </p>
                  <p className="text-sm">
                    {t("horse.loanExplain2")}
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
