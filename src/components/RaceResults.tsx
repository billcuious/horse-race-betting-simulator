
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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh]">
        <ScrollArea className="h-[calc(90vh-120px)]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("results.full")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("results.fullDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("results.raceResults")}</CardTitle>
              <CardDescription>{t("results.details")}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableCaption>{t("results.summary")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Position</TableHead>
                    <TableHead>Horse</TableHead>
                    <TableHead>Commentary</TableHead>
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
                            <Badge className="bg-racing-gold">{t("position.1")}</Badge>
                          )}
                          {result.position === 2 && (
                            <Badge variant="outline">{t("position.2")}</Badge>
                          )}
                          {result.position === 3 && (
                            <Badge variant="outline">{t("position.3")}</Badge>
                          )}
                          {result.position > 3 && result.position}
                        </TableCell>
                        
                        <TableCell>
                          {result.horseName}
                          {isPlayerHorse && (
                            <span className="text-xs ml-1 text-muted-foreground">{t("results.you")}</span>
                          )}
                          {isBetHorse && (
                            <span className="text-xs ml-1 text-blue-500">
                              ({t("betting.selectForBet")})
                            </span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {result.raceEvents && result.raceEvents.length > 0
                            ? result.raceEvents.join(", ")
                            : t("results.noCommentary")}
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
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RaceResults;
