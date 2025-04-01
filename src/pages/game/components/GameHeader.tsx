
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface GameHeaderProps {
  currentRace: number;
  totalRaces: number;
  playerMoney: number;
  seasonGoal: number;
}

const GameHeader = ({ currentRace, totalRaces, playerMoney, seasonGoal }: GameHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-racing-green text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{t("game.title")}</h1>
          <p className="text-sm opacity-80">{t("progress.race").replace("{{current}}", currentRace.toString()).replace("{{total}}", totalRaces.toString())}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSelector className="mr-2" />
          
          <div className="text-right">
            <p className="text-sm opacity-80">{t("header.money")}</p>
            <p className="font-bold">${playerMoney.toLocaleString()}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-80">{t("header.goal")}</p>
            <p className="font-bold">${seasonGoal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
