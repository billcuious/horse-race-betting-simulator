
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RandomEvent } from "@/utils/gameLogic";

interface EventPanelProps {
  event: RandomEvent | null;
  onAcceptEvent: () => void;
  onDismissEvent: () => void;
  playerMoney: number;
}

const EventPanel = ({ event, onAcceptEvent, onDismissEvent, playerMoney }: EventPanelProps) => {
  if (!event) return null;
  
  const isPassiveEvent = event.type === "passive";
  const canAffordEvent = isPassiveEvent || 
    (event.type === "choice" && 
     (!event.choicePrompt || playerMoney >= parseInt(event.choicePrompt.match(/\$(\d+)/) ? event.choicePrompt.match(/\$(\d+)/)![1] : "0")));
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isPassiveEvent ? (
          <p className="text-lg font-medium">
            {event.moneyEffect !== undefined && event.moneyEffect > 0 && (
              <span className="text-green-500">+${event.moneyEffect}</span>
            )}
            {event.moneyEffect !== undefined && event.moneyEffect < 0 && (
              <span className="text-red-500">${event.moneyEffect}</span>
            )}
          </p>
        ) : (
          <p className="text-sm">{event.choicePrompt}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {isPassiveEvent ? (
          <Button 
            className="w-full" 
            onClick={onAcceptEvent}
          >
            Continue
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onDismissEvent}
            >
              Decline
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="flex-1" 
                  disabled={!canAffordEvent}
                >
                  Accept
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Decision</AlertDialogTitle>
                  <AlertDialogDescription>
                    {event.choicePrompt}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onAcceptEvent}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventPanel;
