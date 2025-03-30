
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

// Define race events display with position-based messages
const raceEventMessages: Record<string, (position: number) => string> = {
  "injury": (position) => position <= 3 ? "Pushed too hard and got injured despite placing well" : "Suffered an injury during the race",
  "stumble": (position) => position <= 3 ? "Recovered magnificently from an early stumble" : "Stumbled badly and couldn't recover position",
  "burst": (position) => position <= 3 ? "Had an incredible burst of speed at the critical moment" : "Had a brief burst of speed but couldn't maintain it",
  "tired": (position) => position <= 3 ? "Fought through fatigue to secure position" : "Tired quickly and lost ground",
  "distracted": (position) => position <= 3 ? "Overcame a moment of distraction" : "Got severely distracted at a critical moment",
  "perfect": (position) => position <= 3 ? "Ran a perfect race from start to finish" : "Started perfectly but faded significantly",
  "jockey": (position) => position <= 3 ? "Jockey made brilliant tactical decisions" : "Jockey made a critical tactical error",
  "weather": (position) => position <= 3 ? "Adapted well to challenging weather conditions" : "Struggled with the weather conditions",
  "comeback": (position) => position <= 4 ? "Made an impressive comeback after falling behind" : "Attempted to rally but couldn't make up lost ground",
  "nervous": (position) => position <= 3 ? "Controlled pre-race nerves effectively" : "Was visibly nervous throughout the race",
  "collision": (position) => position <= 5 ? "Navigated through a collision and kept pace" : "Got caught in traffic and lost position",
  "crowd": (position) => position <= 3 ? "Fed off the crowd's energy" : "Was distracted by the roaring crowd",
  "miracle": (position) => position === 1 ? "Performed a miraculous run beyond all expectations" : "Nearly pulled off a miracle finish"
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
                  
                  {/* Display race events with position-based messages */}
                  {result.raceEvents && result.raceEvents.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {result.raceEvents.map((event, idx) => {
                        if (event === "injury") {
                          return (
                            <Badge key={idx} variant="destructive" className="text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {raceEventMessages[event](result.position)}
                            </Badge>
                          );
                        }
                        return (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {raceEventMessages[event] ? raceEventMessages[event](result.position) : event}
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
