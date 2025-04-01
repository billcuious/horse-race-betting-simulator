
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getTrainingCost } from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrainingOptionsProps {
  onSelectTraining: (type: "general" | "speed" | "rest" | "sync") => void;
  trainingsUsed: Record<string, number>;
  playerMoney: number;
  isDisabled: boolean;
}

const TrainingOptions = ({ onSelectTraining, trainingsUsed, playerMoney, isDisabled }: TrainingOptionsProps) => {
  const { t } = useLanguage();
  
  const trainingOptions = [
    {
      id: "general",
      name: t("training.general"),
      description: t("training.general.desc"),
      effects: [
        { stat: t("stats.speed"), change: "+3", color: "text-green-500" },
        { stat: t("stats.control"), change: "+2", color: "text-green-500" },
        { stat: t("stats.endurance"), change: "+2", color: "text-green-500" },
        { stat: t("stats.recovery"), change: "-5", color: "text-red-500" }
      ],
      cost: getTrainingCost("general", trainingsUsed.general || 0)
    },
    {
      id: "speed",
      name: t("training.speed"),
      description: t("training.speed.desc"),
      effects: [
        { stat: t("stats.speed"), change: "+8", color: "text-green-500" },
        { stat: t("stats.control"), change: "-3", color: "text-red-500" },
        { stat: t("stats.endurance"), change: "-3", color: "text-red-500" },
        { stat: t("stats.recovery"), change: "-15", color: "text-red-500" }
      ],
      cost: getTrainingCost("speed", trainingsUsed.speed || 0)
    },
    {
      id: "rest",
      name: t("training.recovery"),
      description: t("training.recovery.desc"),
      effects: [
        { stat: t("stats.speed"), change: "-1", color: "text-red-500" },
        { stat: t("stats.control"), change: "-1", color: "text-red-500" },
        { stat: t("stats.endurance"), change: "-1", color: "text-red-500" },
        { stat: t("stats.recovery"), change: "+15", color: "text-green-500" }
      ],
      cost: 0
    },
    {
      id: "sync",
      name: t("training.control"),
      description: t("training.control.desc"),
      effects: [
        { stat: t("stats.control"), change: "+7", color: "text-green-500" },
        { stat: t("stats.bonus"), change: t("training.sync.bonus"), color: "text-blue-500" }
      ],
      cost: getTrainingCost("sync", trainingsUsed.sync || 0)
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{t("training.title")}</CardTitle>
        <CardDescription>{t("training.select")}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          {/* Improved 2x2 grid layout with proper spacing */}
          <TabsList className="grid grid-cols-2 gap-2 w-full">
            {trainingOptions.map(option => (
              <TabsTrigger 
                key={option.id} 
                value={option.id}
                className="px-2 py-2 text-sm font-medium"
              >
                {option.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-4">
            {trainingOptions.map(option => (
              <TabsContent key={option.id} value={option.id} className="space-y-4">
                <div>
                  <h3 className="font-medium">{option.name} {t("training.training")} (${option.cost})</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                
                <div className="space-y-2">
                  {option.effects.map((effect, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{effect.stat}</span>
                      <span className={`text-sm font-medium ${effect.color}`}>{effect.change}</span>
                    </div>
                  ))}
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full"
                      disabled={isDisabled || playerMoney < option.cost}
                    >
                      {t("training.select")} {option.name}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("training.confirm")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("training.confirmation").replace("{{type}}", option.name).replace("{{cost}}", option.cost.toString())}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onSelectTraining(option.id as any)}
                      >
                        {t("action.confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingOptions;
