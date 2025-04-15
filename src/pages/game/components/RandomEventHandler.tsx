
import { RandomEvent } from "@/utils/gameLogic";
import EventPanel from "@/components/EventPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface RandomEventHandlerProps {
  event: RandomEvent | null;
  onAcceptEvent: () => void;
  onDismissEvent: () => void;
  playerMoney: number;
  isPendingPassiveEvent?: boolean;
}

const RandomEventHandler = ({ 
  event, 
  onAcceptEvent, 
  onDismissEvent, 
  playerMoney,
  isPendingPassiveEvent = false
}: RandomEventHandlerProps) => {
  const { t } = useLanguage();
  
  // We no longer auto-apply passive events; they are now pending
  // until after the race concludes
  
  // Only show choice events that require user interaction
  // or passive events as warnings
  if (!event) return null;
  
  if (event.type === "passive" && isPendingPassiveEvent) {
    return (
      <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
        <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        <AlertTitle className="text-amber-800 dark:text-amber-400">
          {t(event.title, event.title)}
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          {t(event.description, event.description)}
          {event.moneyEffect && (
            <span className="font-semibold">
              {' '}{event.moneyEffect > 0 ? `+$${event.moneyEffect}` : `-$${Math.abs(event.moneyEffect)}`}
            </span>
          )}
          <p className="mt-1 italic text-sm">{t("event.pendingMessage", "This event will be applied after the race.")}</p>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (event.type === "choice") {
    return (
      <EventPanel 
        event={event}
        onAcceptEvent={onAcceptEvent}
        onDismissEvent={onDismissEvent}
        playerMoney={playerMoney}
      />
    );
  }
  
  return null;
};

export default RandomEventHandler;
