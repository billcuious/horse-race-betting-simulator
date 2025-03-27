
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BettingPanel from "@/components/BettingPanel";
import { Horse, RaceResult } from "@/utils/gameLogic";

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
  onViewResults
}: BettingAndRacePanelProps) => {
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
      />
      
      {/* Race Status */}
      {raceInProgress && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-lg font-bold mb-2 animate-gallop">
                Race in Progress...
              </div>
              <p className="text-sm text-muted-foreground">
                Hold your breath!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Previous Race Result Summary */}
      {raceResults.length > 0 && !raceInProgress && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Results</CardTitle>
            <CardDescription>
              Race {currentRace - 1}
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
                          <Badge className="bg-racing-gold">1st</Badge>
                        )}
                        {result.position === 2 && (
                          <Badge variant="outline">2nd</Badge>
                        )}
                        {result.position === 3 && (
                          <Badge variant="outline">3rd</Badge>
                        )}
                      </div>
                      <div className="ml-2">
                        {result.horseName}
                        {isPlayerHorse && (
                          <span className="text-xs ml-1 text-muted-foreground">(You)</span>
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
              View Full Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BettingAndRacePanel;
