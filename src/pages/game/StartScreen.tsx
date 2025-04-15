
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { jockeys } from "@/utils/gameLogic";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircleIcon } from "lucide-react";
import TutorialDialog from "@/components/TutorialDialog";

interface StartScreenProps {
  onStartGame: (playerName: string, jockeyId: string) => void;
}

const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [randomJockeys, setRandomJockeys] = useState<typeof jockeys>([]);
  const [selectedJockeyId, setSelectedJockeyId] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const { t, language } = useLanguage();
  
  // Randomly select 4 jockeys on component mount
  useEffect(() => {
    const allJockeys = [...jockeys];
    const selectedJockeys = [];
    
    // Randomly select 4 jockeys
    for (let i = 0; i < 4; i++) {
      if (allJockeys.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * allJockeys.length);
      selectedJockeys.push(allJockeys[randomIndex]);
      allJockeys.splice(randomIndex, 1);
    }
    
    setRandomJockeys(selectedJockeys);
    
    // Set the default selected jockey
    if (selectedJockeys.length > 0) {
      setSelectedJockeyId(selectedJockeys[0].id);
    }
  }, []);
  
  const handleStartGame = () => {
    if (selectedJockeyId) {
      onStartGame(playerName || "Player", selectedJockeyId);
    }
  };
  
  return (
    <div className="min-h-screen bg-racing-beige flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t("startScreen.title", "Horse Racing Manager")}</CardTitle>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowTutorial(true)}
              className="relative"
              title={t("tutorial.title", "Tutorial")}
            >
              <HelpCircleIcon className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>{t("startScreen.description", "Build your racing legacy by training horses and winning races")}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t("startScreen.playerName", "Player Name")}
            </label>
            <Input
              id="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("startScreen.enterName", "Enter your name")}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                {t("startScreen.jockeySelect", "Choose Your Jockey")}
              </label>
              <LanguageSelector />
            </div>
            
            <div className="space-y-3">
              {randomJockeys.map((jockey) => (
                <div 
                  key={jockey.id}
                  className={`border p-3 rounded-md transition-colors cursor-pointer hover:bg-muted ${
                    selectedJockeyId === jockey.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedJockeyId(jockey.id)}
                >
                  <div className="font-medium">{t(`jockey.${jockey.id}.name`, jockey.name)}</div>
                  <div className="text-sm text-muted-foreground">
                    {t(`jockey.${jockey.id}.description`, jockey.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleStartGame} 
            className="w-full"
            disabled={!selectedJockeyId}
          >
            {t("startScreen.startButton", "Start Racing Career")}
          </Button>
        </CardFooter>
      </Card>
      
      <TutorialDialog 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
};

export default StartScreen;
