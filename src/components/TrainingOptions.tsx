
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getTrainingCost } from "@/utils/gameLogic";

interface TrainingOptionsProps {
  onSelectTraining: (type: "general" | "speed" | "rest" | "sync") => void;
  trainingsUsed: Record<string, number>;
  playerMoney: number;
  isDisabled: boolean;
}

const TrainingOptions = ({ onSelectTraining, trainingsUsed, playerMoney, isDisabled }: TrainingOptionsProps) => {
  const trainingOptions = [
    {
      id: "general",
      name: "General",
      description: "Slight boost to all stats, but decreases Recovery",
      effects: [
        { stat: "Speed", change: "+3", color: "text-green-500" },
        { stat: "Control", change: "+2", color: "text-green-500" },
        { stat: "Endurance", change: "+2", color: "text-green-500" },
        { stat: "Recovery", change: "-5", color: "text-red-500" }
      ],
      cost: getTrainingCost("general", trainingsUsed.general || 0)
    },
    {
      id: "speed",
      name: "Speed",
      description: "Major Speed boost with significant Recovery penalty",
      effects: [
        { stat: "Speed", change: "+8", color: "text-green-500" },
        { stat: "Control", change: "-3", color: "text-red-500" },
        { stat: "Endurance", change: "-3", color: "text-red-500" },
        { stat: "Recovery", change: "-15", color: "text-red-500" }
      ],
      cost: getTrainingCost("speed", trainingsUsed.speed || 0)
    },
    {
      id: "rest",
      name: "Rest",
      description: "Free Recovery boost, but slight decrease to other stats",
      effects: [
        { stat: "Speed", change: "-1", color: "text-red-500" },
        { stat: "Control", change: "-1", color: "text-red-500" },
        { stat: "Endurance", change: "-1", color: "text-red-500" },
        { stat: "Recovery", change: "+15", color: "text-green-500" }
      ],
      cost: 0
    },
    {
      id: "sync",
      name: "Sync",
      description: "Increases Control, with bonus if horse places in next race",
      effects: [
        { stat: "Control", change: "+7", color: "text-green-500" },
        { stat: "Bonus", change: "If your horse places 1st, 2nd, or 3rd in the next race, gain +3 permanent Control", color: "text-blue-500" }
      ],
      cost: getTrainingCost("sync", trainingsUsed.sync || 0)
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Training Options</CardTitle>
        <CardDescription>Choose one training option before each race</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {trainingOptions.map(option => (
              <TabsTrigger key={option.id} value={option.id}>{option.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {trainingOptions.map(option => (
            <TabsContent key={option.id} value={option.id} className="space-y-4">
              <div>
                <h3 className="font-medium">{option.name} Training (${option.cost})</h3>
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
                    Select {option.name} Training
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Training</AlertDialogTitle>
                    <AlertDialogDescription>
                      You chose {option.name} Training. This action costs ${option.cost} and will affect your horse's stats. Proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onSelectTraining(option.id as any)}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingOptions;
