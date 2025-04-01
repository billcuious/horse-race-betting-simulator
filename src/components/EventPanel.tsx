
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RandomEvent } from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventPanelProps {
  event: RandomEvent | null;
  onAcceptEvent: () => void;
  onDismissEvent: () => void;
  playerMoney: number;
}

const EventPanel = ({ event, onAcceptEvent, onDismissEvent, playerMoney }: EventPanelProps) => {
  const { t } = useLanguage();
  
  if (!event) return null;
  
  const isPassiveEvent = event.type === "passive";
  const canAffordEvent = isPassiveEvent || 
    (event.type === "choice" && 
     (!event.choicePrompt || playerMoney >= parseInt(event.choicePrompt.match(/\$(\d+)/) ? event.choicePrompt.match(/\$(\d+)/)![1] : "0")));
  
  // For passive events, we don't render this component anymore (handled in RandomEventHandler)
  if (isPassiveEvent) return null;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm">{event.choicePrompt}</p>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={onDismissEvent}
        >
          {t("action.decline")}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="flex-1" 
              disabled={!canAffordEvent}
            >
              {t("action.accept")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("action.confirm")}</AlertDialogTitle>
              <AlertDialogDescription>
                {event.choicePrompt}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onAcceptEvent}>
                {t("action.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default EventPanel;
