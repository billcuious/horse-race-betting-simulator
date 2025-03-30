
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight } from "lucide-react";

interface JockeyOption {
  id: string;
  name: string;
  title: string;
  description: string;
  effect: string;
  traits: string[];
}

interface StartScreenProps {
  onStartGame: (playerName: string, jockeyId: string) => void;
}

const JOCKEY_OPTIONS: JockeyOption[] = [
  {
    id: "composed",
    name: "Marcus Williams",
    title: "The Composed Jockey",
    description: "Rides at a lower speed but will never be injured during the season.",
    effect: "Your horse starts with -7 Speed, +10 Control, and will never get injured.",
    traits: ["Unshakeable", "Strategic", "Patient"]
  },
  {
    id: "extreme",
    name: "Elena Rodriguez",
    title: "The Extreme Trainer",
    description: "Pushes horses to their limits, unlocking hidden potential at a cost.",
    effect: "Your horse will gain a new positive trait after 4-8 races, but loses Endurance 1.4x faster after each race.",
    traits: ["Demanding", "Visionary", "Intense"]
  },
  {
    id: "veteran",
    name: "James Thornton",
    title: "The Veteran Jockey",
    description: "Decades of experience translate to exceptional control and recovery tactics.",
    effect: "Your horse starts with +15 Control and +10 Recovery, but -5 Speed and -5 Endurance.",
    traits: ["Experienced", "Methodical", "Seasoned"]
  },
  {
    id: "risk",
    name: "Sophia Chen",
    title: "The Risk Taker",
    description: "Lives for the thrill of pushing boundaries, sometimes with spectacular results.",
    effect: "Your horse starts with +12 Speed but -10 Control. Has a 15% chance per race to unlock a temporary massive speed boost.",
    traits: ["Fearless", "Unpredictable", "Aggressive"]
  }
];

const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedJockeyId, setSelectedJockeyId] = useState<string>("composed");
  
  const handleStartGame = () => {
    onStartGame(playerName.trim() || "Player", selectedJockeyId);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-racing-beige p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-racing-green">Horse Racing Simulator</CardTitle>
          <CardDescription>Bet, train, and race your way to victory!</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Enter your name:</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border rounded"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Choose Your Jockey for the Season</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {JOCKEY_OPTIONS.map((jockey) => (
                <div 
                  key={jockey.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedJockeyId === jockey.id ? 'border-racing-green bg-green-50' : 'hover:border-gray-400'}`}
                  onClick={() => setSelectedJockeyId(jockey.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{jockey.name}</h4>
                      <p className="text-sm text-muted-foreground">{jockey.title}</p>
                    </div>
                    {selectedJockeyId === jockey.id && (
                      <Badge className="bg-racing-green">
                        <Check className="h-4 w-4" />
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mb-3">{jockey.description}</p>
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full flex justify-between">
                        <span>Effect Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <h5 className="font-medium mb-2">How This Affects Your Horse</h5>
                      <p className="text-sm">{jockey.effect}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {jockey.traits.map(trait => (
                          <Badge key={trait} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-md bg-muted p-4 text-sm">
            <h3 className="font-medium mb-2">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Train your horse and scout competitors</li>
              <li>Bet on races to earn money</li>
              <li>Your goal is to reach the season target money</li>
              <li>The season consists of {15} races</li>
              <li>You can take loans if needed</li>
              <li>Each horse has unique stats and hidden traits</li>
              <li>Your choice of jockey will affect your horse's starting stats and abilities</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" onClick={handleStartGame}>
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartScreen;
