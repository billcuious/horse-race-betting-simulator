
import { RandomEvent } from "@/utils/gameLogic";
import EventPanel from "@/components/EventPanel";

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
  if (!event) return null;
  
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
