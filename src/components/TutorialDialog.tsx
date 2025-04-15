
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
      title: t("tutorial.welcome.title", "Welcome to Horse Racing Manager!"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.welcome.intro", "This tutorial will guide you through the basics of the game.")}</p>
          <p>{t("tutorial.welcome.role", "You are a jockey managing your horse through a racing season. Your goal is to earn enough money to meet your seasonal goal.")}</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.welcome.objective", "Game Objective:")}</p>
            <p>{t("tutorial.welcome.objectiveDesc", "Earn money by training your horse, placing bets on races, and finishing in top positions.")}</p>
          </div>
        </div>
      )
    },
    {
      title: t("tutorial.horse.title", "Your Horse"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.horse.intro", "Your horse has several key stats that affect its performance:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">{t("stats.speed", "Speed")}:</span> {t("tutorial.horse.speedDesc", "How fast your horse can run.")}</li>
            <li><span className="font-medium">{t("stats.control", "Control")}:</span> {t("tutorial.horse.controlDesc", "How well your horse maintains its position.")}</li>
            <li><span className="font-medium">{t("stats.endurance", "Endurance")}:</span> {t("tutorial.horse.enduranceDesc", "How well your horse performs over the course of a race.")}</li>
            <li><span className="font-medium">{t("stats.recovery", "Recovery")}:</span> {t("tutorial.horse.recoveryDesc", "How quickly your horse recovers between races.")}</li>
          </ul>
          <p>{t("tutorial.horse.traits", "Each horse also has special traits that can provide unique advantages or disadvantages.")}</p>
        </div>
      )
    },
    {
      title: t("tutorial.training.title", "Training"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.training.intro", "Between races, you can choose one training option for your horse:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">{t("training.general", "General Training")}:</span> {t("tutorial.training.generalDesc", "Balanced improvement across all stats.")}</li>
            <li><span className="font-medium">{t("training.speed", "Speed Training")}:</span> {t("tutorial.training.speedDesc", "Focus on improving speed at the cost of recovery.")}</li>
            <li><span className="font-medium">{t("training.recovery", "Rest")}:</span> {t("tutorial.training.restDesc", "Recover 15 points of recovery but no other stat gains.")}</li>
            <li><span className="font-medium">{t("training.control", "Sync Training")}:</span> {t("tutorial.training.syncDesc", "Improve control at the cost of recovery.")}</li>
          </ul>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.training.tip", "Tip:")}:</p>
            <p>{t("tutorial.training.tipDesc", "Balance your training choices. Pushing your horse too hard without rest can lead to poor performance.")}</p>
          </div>
        </div>
      )
    },
    {
      title: t("tutorial.scouting.title", "Scouting"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.scouting.intro", "You can scout your own horse and competitors to learn more about them:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">{t("tutorial.scouting.ownHorse", "Scout Your Horse")}:</span> {t("tutorial.scouting.ownHorseDesc", "Discover hidden traits.")}</li>
            <li><span className="font-medium">{t("tutorial.scouting.basic", "Basic Scout")}:</span> {t("tutorial.scouting.basicDesc", "See basic stats of competitors.")}</li>
            <li><span className="font-medium">{t("tutorial.scouting.deep", "Deep Scout")}:</span> {t("tutorial.scouting.deepDesc", "Reveal a competitor's hidden traits.")}</li>
          </ul>
          <p>{t("tutorial.scouting.cost", "Scouting costs money but provides valuable information that can help you make better betting decisions.")}</p>
        </div>
      )
    },
    {
      title: t("tutorial.betting.title", "Placing Bets"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.betting.intro", "Betting is a key way to earn money in the game:")}</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>{t("tutorial.betting.step1", "Select a horse from the dropdown in the betting panel or from the competitors panel.")}</li>
            <li>{t("tutorial.betting.step2", "Set your bet amount (minimum $100).")}</li>
            <li>{t("tutorial.betting.step3", "Place your bet before the race.")}</li>
          </ol>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.betting.important", "Important:")}:</p>
            <p>{t("tutorial.betting.importantDesc", "You can bet on your own horse or any competitor. Winning bets pay out based on the horse's odds.")}</p>
          </div>
        </div>
      )
    },
    {
      title: t("tutorial.racing.title", "Racing"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.racing.intro", "After training and placing bets, start the race:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("tutorial.racing.results", "The race results are determined by each horse's stats, traits, and some randomness.")}</li>
            <li>{t("tutorial.racing.prize", "Top positions earn prize money for your horse.")}</li>
            <li>{t("tutorial.racing.winnings", "Winning bets pay out based on the odds.")}</li>
          </ul>
          <p>{t("tutorial.racing.decrease", "After each race, your horse's stats will decrease slightly, particularly speed. The recovery stat affects how much other stats decrease.")}</p>
        </div>
      )
    },
    {
      title: t("tutorial.events.title", "Random Events"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.events.intro", "Throughout the season, random events will occur:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">{t("tutorial.events.passive", "Passive Events")}:</span> {t("tutorial.events.passiveDesc", "Happen automatically after a race.")}</li>
            <li><span className="font-medium">{t("tutorial.events.choice", "Choice Events")}:</span> {t("tutorial.events.choiceDesc", "Require you to make a decision.")}</li>
          </ul>
          <p>{t("tutorial.events.effects", "These events can have positive or negative effects on your money, horse stats, or race performance.")}</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.events.strategy", "Strategy:")}:</p>
            <p>{t("tutorial.events.strategyDesc", "Consider your current situation when deciding how to respond to events.")}</p>
          </div>
        </div>
      )
    },
    {
      title: t("tutorial.finance.title", "Financial Management"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.finance.intro", "Managing your money is crucial for success:")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("tutorial.finance.earn", "You earn money from race placements and winning bets.")}</li>
            <li>{t("tutorial.finance.spend", "You spend money on scouting and betting.")}</li>
            <li>{t("tutorial.finance.loan", "If you run low on funds, you can take a loan (with interest).")}</li>
          </ul>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.finance.warning", "Warning:")}:</p>
            <p>{t("tutorial.finance.warningDesc", "If your money falls below $100, you will go bankrupt and lose the game. Plan your finances carefully!")}</p>
          </div>
        </div>
      )
    },
    {
      title: t("tutorial.goal.title", "Season Goal"),
      content: (
        <div className="space-y-4">
          <p>{t("tutorial.goal.intro", "Your ultimate goal is to earn enough money to meet or exceed your season goal.")}</p>
          <p>{t("tutorial.goal.season", "The season consists of multiple races. Your goal is displayed at the top of the screen.")}</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-semibold">{t("tutorial.goal.factors", "Success Factors:")}:</p>
            <ul className="list-disc pl-5">
              <li>{t("tutorial.goal.factor1", "Strategic training")}</li>
              <li>{t("tutorial.goal.factor2", "Smart betting")}</li>
              <li>{t("tutorial.goal.factor3", "Effective scouting")}</li>
              <li>{t("tutorial.goal.factor4", "Good financial management")}</li>
            </ul>
          </div>
          <p className="mt-4 font-medium">{t("tutorial.goal.goodLuck", "Good luck with your racing season!")}</p>
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
            {t("tutorial.step", "Step")} {currentStep + 1} {t("tutorial.of", "of")} {tutorialSteps.length}
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
              {t("tutorial.previous", "Previous")}
            </Button>
            
            <Button 
              type="button" 
              variant="default" 
              onClick={handleNext}
            >
              {currentStep === tutorialSteps.length - 1 ? t("tutorial.finish", "Finish") : t("tutorial.next", "Next")}
              {currentStep < tutorialSteps.length - 1 && <ChevronRightIcon className="h-4 w-4 ml-1" />}
            </Button>
          </div>
          
          {currentStep < tutorialSteps.length - 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSkip}
            >
              {t("tutorial.skip", "Skip Tutorial")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
