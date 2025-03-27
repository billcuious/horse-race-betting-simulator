
import { Progress } from "@/components/ui/progress";

interface GameProgressProps {
  currentRace: number;
  totalRaces: number;
}

const GameProgress = ({ currentRace, totalRaces }: GameProgressProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Season Progress</h2>
        <span className="text-sm">
          Race {currentRace} of {totalRaces}
        </span>
      </div>
      <Progress value={(currentRace - 1) / totalRaces * 100} className="h-2" />
    </div>
  );
};

export default GameProgress;
