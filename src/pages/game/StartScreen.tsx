
import { useState } from "react";
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
  const [selectedJockeyId, setSelectedJockeyId] = useState(jockeys[0].id);
  const [showTutorial, setShowTutorial] = useState(false);
  const { t } = useLanguage();
  
  const handleStartGame = () => {
    onStartGame(playerName || "Player", selectedJockeyId);
  };
  
  return (
    <div className="min-h-screen bg-racing-beige flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t("startScreen.title")}</CardTitle>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowTutorial(true)}
              className="relative"
              title={t("startScreen.tutorial")}
            >
              <HelpCircleIcon className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>{t("startScreen.description")}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t("startScreen.playerName")}
            </label>
            <Input
              id="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("startScreen.nameInput")}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                {t("startScreen.jockeySelect")}
              </label>
              <LanguageSelector />
            </div>
            
            <div className="space-y-3">
              {jockeys.map((jockey) => (
                <div 
                  key={jockey.id}
                  className={`border p-3 rounded-md transition-colors cursor-pointer hover:bg-muted ${
                    selectedJockeyId === jockey.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedJockeyId(jockey.id)}
                >
                  <div className="font-medium">{t(`jockey.${jockey.id}.name`)}</div>
                  <div className="text-sm text-muted-foreground">
                    {t(`jockey.${jockey.id}.description`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleStartGame} className="w-full">
            {t("startScreen.start")}
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
