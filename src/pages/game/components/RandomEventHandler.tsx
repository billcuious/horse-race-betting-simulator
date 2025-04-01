
import { RandomEvent } from "@/utils/gameLogic";
import EventPanel from "@/components/EventPanel";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RandomEventHandlerProps {
  event: RandomEvent | null;
  onAcceptEvent: () => void;
  onDismissEvent: () => void;
  playerMoney: number;
}

const RandomEventHandler = ({ 
  event, 
  onAcceptEvent, 
  onDismissEvent, 
  playerMoney 
}: RandomEventHandlerProps) => {
  // Auto-apply passive events
  useEffect(() => {
    if (event && event.type === "passive") {
      onAcceptEvent();
    }
  }, [event, onAcceptEvent]);
  
  // Only show choice events that require user interaction
  if (!event || event.type === "passive") return null;
  
  return (
    <EventPanel 
      event={event}
      onAcceptEvent={onAcceptEvent}
      onDismissEvent={onDismissEvent}
      playerMoney={playerMoney}
    />
  );
};

export default RandomEventHandler;
