
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameProgressProps {
  currentRace: number;
  totalRaces: number;
}

const GameProgress = ({ currentRace, totalRaces }: GameProgressProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{t("progress.title")}</h2>
        <span className="text-sm">
          {t("progress.race")
            .replace("{{current}}", currentRace.toString())
            .replace("{{total}}", totalRaces.toString())}
        </span>
      </div>
      <Progress value={(currentRace - 1) / totalRaces * 100} className="h-2" />
    </div>
  );
};

export default GameProgress;
