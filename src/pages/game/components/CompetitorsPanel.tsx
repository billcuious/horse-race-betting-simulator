
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HorseCard from "@/components/HorseCard";
import { Horse } from "@/utils/gameLogic";

interface CompetitorsPanelProps {
  competitors: Horse[];
  currentRace: number;
  selectedHorseId: string | null;
  onSelectHorse: (horseId: string | null) => void;
  onScout: (horseId: string, type: "basic" | "deep") => void;
  scoutCosts: {
    basic: number;
    deep: number;
    ownHorse: number;
  };
  isDisabled: boolean;
  playerMoney: number;
}

const CompetitorsPanel = ({
  competitors,
  currentRace,
  selectedHorseId,
  onSelectHorse,
  onScout,
  scoutCosts,
  isDisabled,
  playerMoney
}: CompetitorsPanelProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Competitors</CardTitle>
        <CardDescription>
          Scout horses to get updated information
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2">
          {competitors.map((horse) => (
            <HorseCard 
              key={horse.id}
              horse={horse}
              currentRace={currentRace}
              onScout={onScout}
              onSelect={onSelectHorse}
              isSelected={selectedHorseId === horse.id}
              scoutCosts={scoutCosts}
              isDisabled={isDisabled}
              playerMoney={playerMoney}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsPanel;
