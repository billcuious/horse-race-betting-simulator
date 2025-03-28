
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { RaceResult } from "@/utils/gameLogic";

interface SeasonHistoryProps {
  raceResults: {
    raceNumber: number;
    results: RaceResult[];
  }[];
}

const SeasonHistory = ({ raceResults }: SeasonHistoryProps) => {
  // Handle no race results
  const noResults = raceResults.length === 0;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full flex justify-between items-center" variant="outline">
          <span>View Season History</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Season History</SheetTitle>
        </SheetHeader>
        <div className="pr-4 mt-6 pb-20 overflow-y-auto">
          {noResults ? (
            <Card className="w-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No races completed yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {raceResults.map((race) => (
                <div key={race.raceNumber} className="border rounded-md p-3">
                  <h3 className="font-semibold mb-2">Race {race.raceNumber}</h3>
                  <div className="space-y-1">
                    {race.results.slice(0, 3).map((result, index) => (
                      <div 
                        key={result.horseId} 
                        className="flex justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className={`
                            inline-flex items-center justify-center w-5 h-5 rounded-full text-xs
                            ${index === 0 ? 'bg-yellow-400 text-black' : 
                              index === 1 ? 'bg-gray-300 text-black' : 
                              'bg-amber-700 text-white'}
                          `}>
                            {index + 1}
                          </span>
                          {result.horseName}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(result.finalSpeed * 10) / 10}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SeasonHistory;
