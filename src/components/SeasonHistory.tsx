
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RaceResult } from "@/utils/gameLogic";

interface SeasonHistoryProps {
  raceResults: {
    raceNumber: number;
    results: RaceResult[];
  }[];
}

const SeasonHistory = ({ raceResults }: SeasonHistoryProps) => {
  if (raceResults.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Season History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No races completed yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Season History</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SeasonHistory;
