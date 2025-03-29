
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RaceResult, Horse } from "@/utils/gameLogic";
import { Badge } from "@/components/ui/badge";
import { Trophy, Coins, AlertCircle, Zap } from "lucide-react";

interface RaceResultsProps {
  isOpen: boolean;
  onClose: () => void;
  results: RaceResult[];
  playerHorseId: string;
  betHorseId: string | null;
}

// Define race events display
const raceEventMessages: Record<string, string> = {
  "injury": "Suffered an injury during the race",
  "stumble": "Stumbled at the start",
  "burst": "Had an incredible burst of speed",
  "tired": "Tired quickly in the final stretch",
  "distracted": "Got distracted during a critical moment",
  "perfect": "Ran a perfect race",
  "jockey": "Jockey made a tactical error",
  "weather": "Struggled with weather conditions",
  "comeback": "Made an impressive comeback",
  "nervous": "Showed signs of nervousness"
};

const RaceResults = ({ isOpen, onClose, results, playerHorseId, betHorseId }: RaceResultsProps) => {
  // Sort results by position (should already be sorted, but just in case)
  const sortedResults = [...results].sort((a, b) => a.position - b.position);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Race Results</DialogTitle>
          <DialogDescription>
            Final positions and speeds
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto">
          {sortedResults.map((result) => {
            const isPlayerHorse = result.horseId === playerHorseId;
            const isBetHorse = result.horseId === betHorseId;
            return (
              <div 
                key={result.horseId}
                className={`p-3 border-b last:border-b-0 flex items-center ${
                  isPlayerHorse ? "bg-muted/40" : ""
                } ${isBetHorse ? "border-l-4 border-l-amber-500" : ""}`}
              >
                <div className="mr-2 w-8 text-center font-bold">
                  {result.position === 1 && (
                    <Trophy className="h-6 w-6 text-racing-gold mx-auto" />
                  )}
                  {result.position !== 1 && `${result.position}`}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium flex items-center">
                    {result.horseName}
                    {isPlayerHorse && (
                      <Badge variant="outline" className="ml-2">Your Horse</Badge>
                    )}
                    {isBetHorse && (
                      <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Coins className="h-3 w-3" /> Your Bet
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Speed: {result.finalSpeed.toFixed(1)}
                  </div>
                  
                  {/* Display race events */}
                  {result.raceEvents && result.raceEvents.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {result.raceEvents.map((event, idx) => {
                        if (event === "injury") {
                          return (
                            <Badge key={idx} variant="destructive" className="text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Injured
                            </Badge>
                          );
                        }
                        return (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {raceEventMessages[event] || event}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RaceResults;
