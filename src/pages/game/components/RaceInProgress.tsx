
import { useLanguage } from "@/contexts/LanguageContext";

const RaceInProgress = () => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center animate-pulse max-w-md mx-4">
        <div className="text-2xl font-bold mb-4 animate-gallop">
          {t("race.progress")}
        </div>
        <p className="text-lg text-muted-foreground">
          {t("race.description")}
        </p>
      </div>
    </div>
  );
};

export default RaceInProgress;
