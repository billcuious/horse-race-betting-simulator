
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialDialog = ({ isOpen, onClose }: TutorialDialogProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to Horse Racing Manager!",
      content: (
        <div className="space-y-4">
          <p>This tutorial will guide you through the basics of the game.</p>
          <p>You are a jockey managing your horse through a racing season. Your goal is to earn enough money to meet your seasonal goal.</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Game Objective:</p>
            <p>Earn money by training your horse, placing bets on races, and finishing in top positions.</p>
          </div>
        </div>
      )
    },
    {
      title: "Your Horse",
      content: (
        <div className="space-y-4">
          <p>Your horse has several key stats that affect its performance:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Speed:</span> How fast your horse can run.</li>
            <li><span className="font-medium">Control:</span> How well your horse maintains its position.</li>
            <li><span className="font-medium">Endurance:</span> How well your horse performs over the course of a race.</li>
            <li><span className="font-medium">Recovery:</span> How quickly your horse recovers between races.</li>
          </ul>
          <p>Each horse also has special traits that can provide unique advantages or disadvantages.</p>
        </div>
      )
    },
    {
      title: "Training",
      content: (
        <div className="space-y-4">
          <p>Between races, you can choose one training option for your horse:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">General Training:</span> Balanced improvement across all stats.</li>
            <li><span className="font-medium">Speed Training:</span> Focus on improving speed at the cost of recovery.</li>
            <li><span className="font-medium">Rest:</span> Recover 15 points of recovery but no other stat gains.</li>
            <li><span className="font-medium">Sync Training:</span> Improve control at the cost of recovery.</li>
          </ul>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Tip:</p>
            <p>Balance your training choices. Pushing your horse too hard without rest can lead to poor performance.</p>
          </div>
        </div>
      )
    },
    {
      title: "Scouting",
      content: (
        <div className="space-y-4">
          <p>You can scout your own horse and competitors to learn more about them:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Scout Your Horse:</span> Discover hidden traits.</li>
            <li><span className="font-medium">Basic Scout:</span> See basic stats of competitors.</li>
            <li><span className="font-medium">Deep Scout:</span> Reveal a competitor's hidden traits.</li>
          </ul>
          <p>Scouting costs money but provides valuable information that can help you make better betting decisions.</p>
        </div>
      )
    },
    {
      title: "Placing Bets",
      content: (
        <div className="space-y-4">
          <p>Betting is a key way to earn money in the game:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select a horse from the dropdown in the betting panel or from the competitors panel.</li>
            <li>Set your bet amount (minimum $100).</li>
            <li>Place your bet before the race.</li>
          </ol>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Important:</p>
            <p>You can bet on your own horse or any competitor. Winning bets pay out based on the horse's odds.</p>
          </div>
        </div>
      )
    },
    {
      title: "Racing",
      content: (
        <div className="space-y-4">
          <p>After training and placing bets, start the race:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The race results are determined by each horse's stats, traits, and some randomness.</li>
            <li>Top positions earn prize money for your horse.</li>
            <li>Winning bets pay out based on the odds.</li>
          </ul>
          <p>After each race, your horse's stats will decrease slightly, particularly speed. The recovery stat affects how much other stats decrease.</p>
        </div>
      )
    },
    {
      title: "Random Events",
      content: (
        <div className="space-y-4">
          <p>Throughout the season, random events will occur:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Passive Events:</span> Happen automatically after a race.</li>
            <li><span className="font-medium">Choice Events:</span> Require you to make a decision.</li>
          </ul>
          <p>These events can have positive or negative effects on your money, horse stats, or race performance.</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Strategy:</p>
            <p>Consider your current situation when deciding how to respond to events.</p>
          </div>
        </div>
      )
    },
    {
      title: "Financial Management",
      content: (
        <div className="space-y-4">
          <p>Managing your money is crucial for success:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You earn money from race placements and winning bets.</li>
            <li>You spend money on scouting and betting.</li>
            <li>If you run low on funds, you can take a loan (with interest).</li>
          </ul>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Warning:</p>
            <p>If your money falls below $100, you will go bankrupt and lose the game. Plan your finances carefully!</p>
          </div>
        </div>
      )
    },
    {
      title: "Season Goal",
      content: (
        <div className="space-y-4">
          <p>Your ultimate goal is to earn enough money to meet or exceed your season goal.</p>
          <p>The season consists of multiple races. Your goal is displayed at the top of the screen.</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">Success Factors:</p>
            <ul className="list-disc pl-5">
              <li>Strategic training</li>
              <li>Smart betting</li>
              <li>Effective scouting</li>
              <li>Good financial management</li>
            </ul>
          </div>
          <p className="mt-4 font-medium">Good luck with your racing season!</p>
        </div>
      )
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {tutorialSteps[currentStep].content}
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button 
              type="button" 
              variant="default" 
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
              {currentStep < tutorialSteps.length - 1 && <ChevronRightIcon className="h-4 w-4 ml-1" />}
            </Button>
          </div>
          
          {currentStep < tutorialSteps.length - 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
            >
              Skip Tutorial
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
