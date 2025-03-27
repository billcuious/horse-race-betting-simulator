
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RaceResult, Horse } from "@/utils/gameLogic";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface RaceResultsProps {
  isOpen: boolean;
  onClose: () => void;
  results: RaceResult[];
  playerHorseId: string;
}

const RaceResults = ({ isOpen, onClose, results, playerHorseId }: RaceResultsProps) => {
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
            return (
              <div 
                key={result.horseId}
                className={`p-3 border-b last:border-b-0 flex items-center ${
                  isPlayerHorse ? "bg-muted/40" : ""
                }`}
              >
                <div className="mr-2 w-8 text-center font-bold">
                  {result.position === 1 && (
                    <Trophy className="h-6 w-6 text-racing-gold mx-auto" />
                  )}
                  {result.position !== 1 && `${result.position}`}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">
                    {result.horseName}
                    {isPlayerHorse && (
                      <Badge variant="outline" className="ml-2">Your Horse</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Speed: {result.finalSpeed.toFixed(1)}
                  </div>
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
