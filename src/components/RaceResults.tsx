
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Horse, RaceResult } from "@/utils/gameLogic";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RaceResultsProps {
  isOpen: boolean;
  onClose: () => void;
  results: RaceResult[];
  playerHorseId: string;
  betHorseId: string | null;
}

const RaceResults = ({
  isOpen,
  onClose,
  results,
  playerHorseId,
  betHorseId,
}: RaceResultsProps) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <ScrollArea className="h-[calc(90vh-120px)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("results.title", "Race Results")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("results.subtitle", "Final positions and details")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("results.raceResults", "Race Results")}</CardTitle>
              <CardDescription>{t("results.details", "Details of the race outcomes")}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableCaption>{t("results.summary", "Race summary and final positions")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">{t("position.label", "Position")}</TableHead>
                    <TableHead>{t("results.horse", "Horse")}</TableHead>
                    <TableHead>{t("results.commentary", "Commentary")}</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {results.sort((a, b) => a.position - b.position).map((result) => {
                    const isPlayerHorse = result.horseId === playerHorseId;
                    const isBetHorse = result.horseId === betHorseId;
                    
                    return (
                      <TableRow key={result.horseId}>
                        <TableCell className="font-medium">
                          {result.position === 1 && (
                            <Badge className="bg-racing-gold">{t("position.1", "1st")}</Badge>
                          )}
                          {result.position === 2 && (
                            <Badge variant="outline">{t("position.2", "2nd")}</Badge>
                          )}
                          {result.position === 3 && (
                            <Badge variant="outline">{t("position.3", "3rd")}</Badge>
                          )}
                          {result.position > 3 && result.position}
                        </TableCell>
                        
                        <TableCell>
                          {result.horseName}
                          {isPlayerHorse && (
                            <span className="text-xs ml-1 text-muted-foreground">{t("results.you", "(You)")}</span>
                          )}
                          {isBetHorse && (
                            <span className="text-xs ml-1 text-blue-500">
                              ({t("betting.selectForBet", "Bet")})
                            </span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {result.raceEvents && result.raceEvents.length > 0
                            ? result.raceEvents.map((event, index) => (
                                <div key={index}>{t(event, event)}</div>
                              ))
                            : t("results.noCommentary", "No notable events")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </ScrollArea>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onClose}>{t("actions.close", "Close")}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RaceResults;
