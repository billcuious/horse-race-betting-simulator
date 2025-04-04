import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BettingPanel from "@/components/BettingPanel";
import { Horse, RaceResult } from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface BettingAndRacePanelProps {
  selectedHorseId: string | null;
  horses: Horse[];
  onPlaceBet: (horseId: string, amount: number) => void;
  playerMoney: number;
  currentRace: number;
  onStartRace: () => void;
  raceInProgress: boolean;
  raceResults: RaceResult[];
  playerHorseId: string;
  onViewResults: () => void;
  onBetAmountChange: (amount: number) => void;
}

const BettingAndRacePanel = ({
  selectedHorseId,
  horses,
  onPlaceBet,
  playerMoney,
  currentRace,
  onStartRace,
  raceInProgress,
  raceResults,
  playerHorseId,
  onViewResults,
  onBetAmountChange
}: BettingAndRacePanelProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Betting Panel */}
      <BettingPanel 
        selectedHorseId={selectedHorseId}
        horses={horses}
        onPlaceBet={onPlaceBet}
        playerMoney={playerMoney}
        currentRace={currentRace}
        onStartRace={onStartRace}
        betInProgress={raceInProgress}
        onBetAmountChange={onBetAmountChange}
      />
      
      {/* Previous Race Result Summary */}
      {raceResults.length > 0 && !raceInProgress && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("results.title")}</CardTitle>
            <CardDescription>
              {t("results.race").replace("{{number}}", (currentRace - 1).toString())}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {raceResults
                .sort((a, b) => a.position - b.position)
                .slice(0, 3)
                .map((result) => {
                  const isPlayerHorse = result.horseId === playerHorseId;
                  return (
                    <div 
                      key={result.horseId}
                      className={`p-2 border rounded-md flex items-center ${
                        isPlayerHorse ? "bg-muted/40" : ""
                      }`}
                    >
                      <div className="w-8 text-center font-bold">
                        {result.position === 1 && (
                          <Badge className="bg-racing-gold">{t("position.1")}</Badge>
                        )}
                        {result.position === 2 && (
                          <Badge variant="outline">{t("position.2")}</Badge>
                        )}
                        {result.position === 3 && (
                          <Badge variant="outline">{t("position.3")}</Badge>
                        )}
                      </div>
                      <div className="ml-2">
                        {result.horseName}
                        {isPlayerHorse && (
                          <span className="text-xs ml-1 text-muted-foreground">{t("results.you")}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onViewResults}
            >
              {t("results.view")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BettingAndRacePanel;
