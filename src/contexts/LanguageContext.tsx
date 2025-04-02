
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define language types
export type Language = "en" | "es";

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
export const translations = {
  en: {
    // Game title and start screen
    "game.title": "Horse Racing Simulator",
    "game.subtitle": "Bet, train, and race your way to victory!",
    "game.startButton": "Start Game",
    "game.nameLabel": "Enter your name:",
    "game.namePlaceholder": "Your Name",
    "game.chooseJockey": "Choose Your Jockey for the Season",
    "game.effectDetails": "Effect Details",
    "game.gameRules": "Game Rules:",
    "game.rules.train": "Train your horse and scout competitors",
    "game.rules.bet": "Bet on races to earn money",
    "game.rules.goal": "Your goal is to reach the season target money",
    "game.rules.season": "The season consists of 15 races",
    "game.rules.loans": "You can take loans if needed",
    "game.rules.stats": "Each horse has unique stats and hidden traits",
    "game.rules.jockey": "Your choice of jockey will affect your horse's starting stats and abilities",
    
    // Jockey titles
    "jockey.composed.title": "The Composed Jockey",
    "jockey.composed.desc": "Rides at a lower speed but will never be injured during the season.",
    "jockey.composed.effect": "Your horse starts with -7 Speed, +10 Control, and will never get injured.",
    "jockey.extreme.title": "The Extreme Trainer",
    "jockey.extreme.desc": "Pushes horses to their limits, unlocking hidden potential at a cost.",
    "jockey.extreme.effect": "Your horse will gain a new positive trait after 4-8 races, but loses Endurance 1.4x faster after each race.",
    "jockey.veteran.title": "The Veteran Jockey",
    "jockey.veteran.desc": "Decades of experience translate to exceptional control and recovery tactics.",
    "jockey.veteran.effect": "Your horse starts with +15 Control and +10 Recovery, but -5 Speed and -5 Endurance.",
    "jockey.risk.title": "The Risk Taker",
    "jockey.risk.desc": "Lives for the thrill of pushing boundaries, sometimes with spectacular results.",
    "jockey.risk.effect": "Your horse has a 15% chance per race to unlock a temporary massive speed boost, but injury risk is increased by 1.5x.",
    
    // Traits
    "traits.title": "How This Affects Your Horse",
    "trait.effectsPerformance": "affects this horse's performance.",
    "trait.moreToDiscover": "More traits to discover",
    
    // Game header
    "header.money": "Money",
    "header.goal": "Goal",
    
    // Horse management
    "horse.yourHorse": "Your Horse",
    "horse.manage": "Manage and train your horse before each race",
    "horse.financial": "Financial Options",
    "horse.takeLoan": "Take a loan if you're short on cash",
    "horse.loanButton": "Take Loan",
    "horse.currentDebt": "Current debt:",
    "horse.loanInfo": "How do loans work?",
    "horse.loanDetails": "Loan Information",
    "horse.loanExplain1": "You can take a loan to get more money for betting and training. The loan amount is based on your current money.",
    "horse.loanExplain2": "The total loan amount will be deducted from your final money at the end of the season.",
    "horse.confirmLoan": "Confirm Loan",
    "horse.loanDescription": "You're about to take a loan of ${{amount}}. This will need to be repaid at the end of the season. Proceed?",
    "horse.mildInjury": "Mild Injury",
    "horse.majorInjury": "Major Injury",
    
    // Game progress
    "progress.title": "Season Progress",
    "progress.race": "Race {{current}} of {{total}}",
    
    // Horse stats
    "stats.speed": "Speed",
    "stats.control": "Control",
    "stats.recovery": "Recovery",
    "stats.endurance": "Endurance",
    "stats.outdated": "Stats may be outdated",
    "stats.outdatedWarning": "Stats may have changed since last scouted",
    "stats.traits": "Traits",
    "stats.bonus": "Bonus",
    
    // Scouting
    "scout.button": "Scout",
    "scout.basic": "Scout (${{cost}})",
    "scout.deep": "Deep Scout (${{cost}})",
    "scout.ownHorse": "Scout Own Horse (${{cost}})",
    "scout.lastRace": "Last Scouted: Race {{race}}",
    
    // Betting
    "betting.title": "Place Your Bet",
    "betting.selectDescription": "Race {{race}} - Select a horse and bet amount",
    "betting.select": "Select a horse to place your bet",
    "betting.amount": "Bet Amount",
    "betting.place": "Place Bet",
    "betting.start": "Start Race",
    "betting.noSelection": "No horse selected",
    "betting.max": "Max",
    "betting.selectedHorse": "Selected Horse",
    "betting.selected": "Selected",
    "betting.selectForBet": "Select for Bet",
    "betting.confirmTitle": "Confirm Bet",
    "betting.confirmDescription": "Bet ${{amount}} on {{horse}}?",
    
    // Results
    "results.title": "Latest Results",
    "results.race": "Race {{number}}",
    "results.view": "View Full Results",
    "results.you": "(You)",
    
    // Race positions
    "position.1": "1st",
    "position.2": "2nd",
    "position.3": "3rd",
    
    // Bet warning
    "betWarning.title": "No Bet Placed",
    "betWarning.description": "You've selected {{horseName}} but haven't placed a bet yet.",
    "betWarning.question": "Would you like to place a bet before the race starts?",
    "betWarning.max": "Max:",
    "betWarning.continue": "Continue Without Betting",
    "betWarning.placeBet": "Place Bet & Start Race",
    
    // Race progress
    "race.progress": "Race in Progress...",
    "race.description": "The horses are thundering down the track!",
    
    // Game end
    "end.seasonOver": "Season Over!",
    "end.win": "Congratulations! You've reached your financial goal!",
    "end.lose": "Better luck next season. You didn't reach your financial goal.",
    "end.loan": "Outstanding Loan:",
    "end.netWorth": "Net Worth:",
    "end.finalStats": "Final Horse Stats:",
    "end.playAgain": "Play Again",
    
    // Buttons and common actions
    "action.cancel": "Cancel",
    "action.confirm": "Confirm",
    "action.accept": "Accept",
    "action.decline": "Decline",
    
    // Languages
    "language.english": "English",
    "language.spanish": "Spanish",
    
    // Training options
    "training.title": "Training Options",
    "training.general": "General",
    "training.general.desc": "Slight boost to all stats, but decreases Recovery",
    "training.speed": "Speed",
    "training.speed.desc": "Major Speed boost with significant Recovery penalty",
    "training.recovery": "Rest",
    "training.recovery.desc": "Free Recovery boost, but slight decrease to other stats",
    "training.control": "Control",
    "training.control.desc": "Increases Control, with bonus if horse places in next race",
    "training.training": "Training",
    "training.select": "Select",
    "training.confirm": "Confirm Training",
    "training.confirmation": "You chose {{type}} Training. This action costs ${{cost}} and will affect your horse's stats. Proceed?",
    "training.unavailable": "Already trained for this race",
    "training.sync.bonus": "If your horse places 1st, 2nd, or 3rd in the next race, gain +3 permanent Control",
    
    // Competitors
    "competitors.title": "Competitors",
    "competitors.scouting": "Stats shown are from last scouting. Scout horses to get updated information.",
    "competitors.training": "Training",
    "competitors.history": "Race History",
    "competitors.selectForBet": "Select a competitor to place a bet",
    "competitors.viewAll": "View All Competitors",
    "competitors.allCompetitors": "All Competitors",
    
    // Common trait names and descriptions
    "trait.FastStarter": "Fast Starter",
    "trait.Endurance": "Endurance",
    "trait.Unpredictable": "Unpredictable",
    "trait.Sprinter": "Sprinter",
    "trait.Consistent": "Consistent",
    "trait.MuddyTrackExpert": "Muddy Track Expert",
    "trait.Nervous": "Nervous",
    "trait.WeatherSensitive": "Weather Sensitive",
    "trait.InjuryProne": "Injury Prone",
    "trait.LateCharger": "Late Charger",
    "trait.Focused": "Focused",
    "trait.EasilyDistracted": "Easily Distracted",
    "trait.TrackMemorizer": "Track Memorizer",
    "trait.RecoveryExpert": "Recovery Expert",
    "trait.SlowStarter": "Slow Starter",
    "trait.CrowdPleaser": "Crowd Pleaser",
    "trait.Stamina": "Stamina",
    "trait.Adaptable": "Adaptable",
    "trait.Competitive": "Competitive",
    "trait.TemperatureSensitive": "Temperature Sensitive",
    "trait.Lucky": "Lucky",
    "trait.FastFinisher": "Fast Finisher",
    "trait.Tactical": "Tactical",
    "trait.Fragile": "Fragile",
    "trait.ChampionBlood": "Champion Blood",
    "trait.Underdog": "Underdog",
    "trait.DarkHorse": "Dark Horse",
    "trait.StrongFinisher": "Strong Finisher",
    "trait.CrowdFavorite": "Crowd Favorite",
    "trait.IronHorse": "Iron Horse",
    "trait.NervousRunner": "Nervous Runner",
    "trait.PoorStarter": "Poor Starter",
    "trait.MudRunner": "Mud Runner",
    "trait.LateBloomer": "Late Bloomer",
    "trait.TrainingResistant": "Training Resistant",
    "trait.Inconsistent": "Inconsistent",
    "trait.Temperamental": "Temperamental",
    "trait.SpotlightShy": "Spotlight Shy",
    "trait.LegendaryBloodline": "Legendary Bloodline",
    "trait.SixthSense": "Sixth Sense",
    "trait.PhoenixSpirit": "Phoenix Spirit",
    "trait.HeartofGold": "Heart of Gold",
    "trait.SoulBond": "Soul Bond",
    "trait.TimeDilation": "Time Dilation",
    "trait.MiracleWorker": "Miracle Worker",
    "trait.RiskTaker": "Risk Taker",
    "trait.Uninjurable": "Uninjurable",
    "trait.ExtremeTraining": "Extreme Training",
    "trait.VeteranTactics": "Veteran Tactics",
    
    // Trait descriptions
    "traitDesc.FastStarter": "This horse bursts out of the gate with remarkable speed.",
    "traitDesc.Endurance": "Can maintain performance over long distances without tiring.",
    "traitDesc.Unpredictable": "Sometimes brilliant, sometimes disappointing - you never know what you'll get.",
    "traitDesc.Sprinter": "Excels at short, explosive bursts of speed.",
    "traitDesc.Consistent": "Rarely has bad races, tends to perform at a steady level.",
    "traitDesc.MuddyTrackExpert": "Performs exceptionally well on wet or muddy tracks.",
    "traitDesc.Nervous": "Tends to get unsettled by crowds and noise.",
    "traitDesc.WeatherSensitive": "Performance varies significantly based on weather conditions.",
    "traitDesc.InjuryProne": "Has a history of getting injured more easily than other horses.",
    "traitDesc.LateCharger": "Often comes from behind to finish strong.",
    "traitDesc.Focused": "Maintains concentration throughout the race.",
    "traitDesc.EasilyDistracted": "Can lose focus during critical moments.",
    "traitDesc.TrackMemorizer": "Performs better on familiar tracks.",
    "traitDesc.RecoveryExpert": "Bounces back quickly after races.",
    "traitDesc.SlowStarter": "Takes time to reach full speed.",
    "traitDesc.CrowdPleaser": "Performs better when there's a large audience.",
    "traitDesc.Stamina": "Can maintain high performance for longer periods.",
    "traitDesc.Adaptable": "Quickly adjusts to changing race conditions.",
    "traitDesc.Competitive": "Performs better when racing neck-to-neck with others.",
    "traitDesc.TemperatureSensitive": "Performance varies based on temperature.",
    "traitDesc.Lucky": "Sometimes defies the odds in surprising ways.",
    "traitDesc.FastFinisher": "Has an impressive final sprint capability.",
    "traitDesc.Tactical": "Seems to make smart positioning decisions during races.",
    "traitDesc.Fragile": "More susceptible to injuries and fatigue.",
    "traitDesc.ChampionBlood": "Descends from a line of winning racehorses.",
    "traitDesc.Underdog": "Often performs better than statistics would predict.",
    "traitDesc.DarkHorse": "Tends to surprise competitors when least expected.",
    "traitDesc.StrongFinisher": "Has incredible endurance in the final stretch.",
    "traitDesc.CrowdFavorite": "The audience loves this horse, boosting its confidence.",
    "traitDesc.IronHorse": "Known for remarkable resilience and stamina.",
    "traitDesc.NervousRunner": "Gets anxious before and during races.",
    "traitDesc.PoorStarter": "Takes longer than most to hit stride after the gate opens.",
    "traitDesc.MudRunner": "Performs better in poor weather and muddy track conditions.",
    "traitDesc.LateBloomer": "Develops strength and speed later in the season.",
    "traitDesc.TrainingResistant": "Doesn't always respond well to intensive training regimens.",
    "traitDesc.Inconsistent": "Performance varies unpredictably from race to race.",
    "traitDesc.Temperamental": "Mood can greatly affect race performance.",
    "traitDesc.SpotlightShy": "Doesn't perform well when favored to win.",
    "traitDesc.LegendaryBloodline": "Descended from the greatest champions in racing history. A rare gift indeed.",
    "traitDesc.SixthSense": "This horse seems to anticipate obstacles before they appear. Truly extraordinary.",
    "traitDesc.PhoenixSpirit": "Can rise from the depths of exhaustion in miraculous fashion.",
    "traitDesc.HeartofGold": "Shows incredible determination in the face of challenges.",
    "traitDesc.SoulBond": "Forms a deep connection with its jockey, enhancing performance.",
    "traitDesc.TimeDilation": "Appears to enter a state where time itself slows down during critical moments.",
    "traitDesc.MiracleWorker": "Known to achieve the impossible when all hope seems lost.",
    "traitDesc.RiskTaker": "This horse thrives on danger and takes chances other horses wouldn't dare.",
    "traitDesc.Uninjurable": "This horse has a remarkable constitution, able to avoid injuries that would stop others.",
    "traitDesc.ExtremeTraining": "This horse undergoes intense training that pushes the limits of equine performance.",
    "traitDesc.VeteranTactics": "Years of experience have taught this horse to navigate even the most challenging races.",
    
    // Season History Translations
    "seasonHistory.viewButton": "View Season History",
    "seasonHistory.title": "Season History",
    "seasonHistory.noRaces": "No races completed yet",
    "seasonHistory.race": "Race",
    
    // Race Results Translations
    "raceResults.title": "Race Results",
    "raceResults.subtitle": "Final positions and speeds",
    "raceResults.yourHorse": "Your Horse",
    "raceResults.yourBet": "Your Bet",
    
    // Toast Notifications
    "toast.success": "Success",
    "toast.error": "Error",
    "toast.info": "Info",
    "toast.warning": "Warning",
    
    // Race Events - Good outcomes (position <= 3)
    "raceEvent.injury.good": "Pushed too hard and got injured despite placing well",
    "raceEvent.stumble.good": "Recovered magnificently from an early stumble",
    "raceEvent.burst.good": "Had an incredible burst of speed at the critical moment",
    "raceEvent.tired.good": "Fought through fatigue to secure position",
    "raceEvent.distracted.good": "Overcame a moment of distraction",
    "raceEvent.perfect.good": "Ran a perfect race from start to finish",
    "raceEvent.jockey.good": "Jockey made brilliant tactical decisions",
    "raceEvent.weather.good": "Adapted well to challenging weather conditions",
    "raceEvent.comeback.good": "Made an impressive comeback after falling behind",
    "raceEvent.nervous.good": "Controlled pre-race nerves effectively",
    "raceEvent.collision.good": "Navigated through a collision and kept pace",
    "raceEvent.crowd.good": "Fed off the crowd's energy",
    "raceEvent.miracle.good": "Performed a miraculous run beyond all expectations",
    
    // Race Events - Bad outcomes (position > 3)
    "raceEvent.injury.bad": "Suffered an injury during the race",
    "raceEvent.stumble.bad": "Stumbled badly and couldn't recover position",
    "raceEvent.burst.bad": "Had a brief burst of speed but couldn't maintain it",
    "raceEvent.tired.bad": "Tired quickly and lost ground",
    "raceEvent.distracted.bad": "Got severely distracted at a critical moment",
    "raceEvent.perfect.bad": "Started perfectly but faded significantly",
    "raceEvent.jockey.bad": "Jockey made a critical tactical error",
    "raceEvent.weather.bad": "Struggled with the weather conditions",
    "raceEvent.comeback.bad": "Attempted to rally but couldn't make up lost ground",
    "raceEvent.nervous.bad": "Was visibly nervous throughout the race",
    "raceEvent.collision.bad": "Got caught in traffic and lost position",
    "raceEvent.crowd.bad": "Was distracted by the roaring crowd",
    "raceEvent.miracle.bad": "Nearly pulled off a miracle finish"
  },
  es: {
    // Game title and start screen
    "game.title": "Simulador de Carreras de Caballos",
    "game.subtitle": "¡Apuesta, entrena y corre hacia la victoria!",
    "game.startButton": "Iniciar Juego",
    "game.nameLabel": "Ingresa tu nombre:",
    "game.namePlaceholder": "Tu Nombre",
    "game.chooseJockey": "Elige Tu Jinete para la Temporada",
    "game.effectDetails": "Detalles del Efecto",
    "game.gameRules": "Reglas del Juego:",
    "game.rules.train": "Entrena a tu caballo y estudia a los competidores",
    "game.rules.bet": "Apuesta en carreras para ganar dinero",
    "game.rules.goal": "Tu objetivo es alcanzar el dinero objetivo de la temporada",
    "game.rules.season": "La temporada consta de 15 carreras",
    "game.rules.loans": "Puedes tomar préstamos si es necesario",
    "game.rules.stats": "Cada caballo tiene estadísticas únicas y rasgos ocultos",
    "game.rules.jockey": "Tu elección de jinete afectará las estadísticas iniciales y habilidades de tu caballo",
    
    // Jockey titles
    "jockey.composed.title": "El Jinete Sereno",
    "jockey.composed.desc": "Corre a menor velocidad pero nunca se lesionará durante la temporada.",
    "jockey.composed.effect": "Tu caballo comienza con -7 Velocidad, +10 Control, y nunca se lesionará.",
    "jockey.extreme.title": "El Entrenador Extremo",
    "jockey.extreme.desc": "Lleva a los caballos al límite, desbloqueando potencial oculto a un costo.",
    "jockey.extreme.effect": "Tu caballo ganará un nuevo rasgo positivo después de 4-8 carreras, pero pierde Resistencia 1.4 veces más rápido después de cada carrera.",
    "jockey.veteran.title": "El Jinete Veterano",
    "jockey.veteran.desc": "Décadas de experiencia se traducen en un control excepcional y tácticas de recuperación.",
    "jockey.veteran.effect": "Tu caballo comienza con +15 Control y +10 Recuperación, pero -5 Velocidad y -5 Resistencia.",
    "jockey.risk.title": "El Arriesgado",
    "jockey.risk.desc": "Vive por la emoción de empujar los límites, a veces con resultados espectaculares.",
    "jockey.risk.effect": "Tu caballo tiene un 15% de probabilidad por carrera de desbloquear un impulso de velocidad masivo temporal, pero el riesgo de lesión aumenta en 1.5 veces.",
    
    // Traits
    "traits.title": "Cómo Afecta Esto a Tu Caballo",
    "trait.effectsPerformance": "afecta el rendimiento de este caballo.",
    "trait.moreToDiscover": "Más rasgos por descubrir",
    
    // Game header
    "header.money": "Dinero",
    "header.goal": "Objetivo",
    
    // Horse management
    "horse.yourHorse": "Tu Caballo",
    "horse.manage": "Administra y entrena a tu caballo antes de cada carrera",
    "horse.financial": "Opciones Financieras",
    "horse.takeLoan": "Toma un préstamo si te falta dinero",
    "horse.loanButton": "Tomar Préstamo",
    "horse.currentDebt": "Deuda actual:",
    "horse.loanInfo": "¿Cómo funcionan los préstamos?",
    "horse.loanDetails": "Información del Préstamo",
    "horse.loanExplain1": "Puedes tomar un préstamo para obtener más dinero para apostar y entrenar. El monto del préstamo se basa en tu dinero actual.",
    "horse.loanExplain2": "El monto total del préstamo se deducirá de tu dinero final al final de la temporada.",
    "horse.confirmLoan": "Confirmar Préstamo",
    "horse.loanDescription": "Estás a punto de tomar un préstamo de ${{amount}}. Deberá ser reembolsado al final de la temporada. ¿Proceder?",
    "horse.mildInjury": "Lesión Leve",
    "horse.majorInjury": "Lesión Grave",
    
    // Game progress
    "progress.title": "Progreso de Temporada",
    "progress.race": "Carrera {{current}} de {{total}}",
    
    // Horse stats
    "stats.speed": "Velocidad",
    "stats.control": "Control",
    "stats.recovery": "Recuperación",
    "stats.endurance": "Resistencia",
    "stats.outdated": "Estadísticas desactualizadas",
    "stats.outdatedWarning": "Las estadísticas pueden haber cambiado desde la última exploración",
    "stats.traits": "Rasgos",
    "stats.bonus": "Bono",
    
    // Scouting
    "scout.button": "Explorar",
    "scout.basic": "Explorar (${{cost}})",
    "scout.deep": "Explorar a fondo (${{cost}})",
    "scout.ownHorse": "Explorar propio (${{cost}})",
    "scout.lastRace": "Última exploración: Carrera {{race}}",
    
    // Betting
    "betting.title": "Hacer Apuesta",
    "betting.selectDescription": "Carrera {{race}} - Elige caballo y monto",
    "betting.select": "Selecciona un caballo para apostar",
    "betting.amount": "Monto",
    "betting.place": "Apostar",
    "betting.start": "Iniciar Carrera",
    "betting.noSelection": "Ningún caballo elegido",
    "betting.max": "Máx",
    "betting.selectedHorse": "Caballo Elegido",
    "betting.selected": "Elegido",
    "betting.selectForBet": "Elegir",
    "betting.confirmTitle": "Confirmar Apuesta",
    "betting.confirmDescription": "¿Apostar ${{amount}} por {{horse}}?",
    
    // Results
    "results.title": "Últimos Resultados",
    "results.race": "Carrera {{number}}",
    "results.view": "Ver Resultados",
    "results.you": "(Tú)",
    
    // Race positions
    "position.1": "1ro",
    "position.2": "2do",
    "position.3": "3ro",
    
    // Bet warning
    "betWarning.title": "Sin Apuesta",
    "betWarning.description": "Has seleccionado a {{horseName}} pero no has apostado.",
    "betWarning.question": "¿Quieres apostar antes de iniciar?",
    "betWarning.max": "Máx:",
    "betWarning.continue": "Continuar Sin Apostar",
    "betWarning.placeBet": "Apostar e Iniciar",
    
    // Race progress
    "race.progress": "Carrera en Progreso...",
    "race.description": "¡Los caballos están galopando en la pista!",
    
    // Game end
    "end.seasonOver": "¡Temporada Finalizada!",
    "end.win": "¡Felicidades! ¡Has alcanzado tu objetivo financiero!",
    "end.lose": "Mejor suerte en la próxima temporada. No alcanzaste tu objetivo financiero.",
    "end.loan": "Préstamo Pendiente:",
    "end.netWorth": "Valor Neto:",
    "end.finalStats": "Estadísticas Finales:",
    "end.playAgain": "Jugar de Nuevo",
    
    // Buttons and common actions
    "action.cancel": "Cancelar",
    "action.confirm": "Confirmar",
    "action.accept": "Aceptar",
    "action.decline": "Rechazar",
    
    // Languages
    "language.english": "Inglés",
    "language.spanish": "Español",
    
    // Training options
    "training.title": "Entrenamiento",
    "training.general": "General",
    "training.general.desc": "Mejora todas las estadísticas, reduce recuperación",
    "training.speed": "Velocidad",
    "training.speed.desc": "Gran mejora de velocidad con penalización",
    "training.recovery": "Descanso",
    "training.recovery.desc": "Mejora recuperación, ligera caída en otras estadísticas",
    "training.control": "Control",
    "training.control.desc": "Mejora control, con bonificación si tu caballo se posiciona bien",
    "training.training": "Entr.",
    "training.select": "Elegir",
    "training.confirm": "Confirmar Entrenamiento",
    "training.confirmation": "Elegiste Entrenamiento de {{type}}. Cuesta ${{cost}} y afectará las estadísticas. ¿Continuar?",
    "training.unavailable": "Ya has entrenado para esta carrera",
    "training.sync.bonus": "Si tu caballo queda 1ro, 2do o 3ro en la próxima carrera, gana +3 Control permanente",
    
    // Competitors
    "competitors.title": "Competidores",
    "competitors.scouting": "Estadísticas de última exploración. Explora para actualizar.",
    "competitors.training": "Entrenamiento",
    "competitors.history": "Historial",
    "competitors.selectForBet": "Selecciona un competidor para apostar",
    "competitors.viewAll": "Ver Todos",
    "competitors.allCompetitors": "Todos los Competidores",
    
    // Common trait names and descriptions - using shorter Spanish terms where possible
    "trait.FastStarter": "Arrancador",
    "trait.Endurance": "Resistente",
    "trait.Unpredictable": "Impredecible",
    "trait.Sprinter": "Velocista",
    "trait.Consistent": "Constante",
    "trait.MuddyTrackExpert": "Experto en lodo",
    "trait.Nervous": "Nervioso",
    "trait.WeatherSensitive": "Sensible al clima",
    "trait.InjuryProne": "Propenso a lesiones",
    "trait.LateCharger": "Carga tardía",
    "trait.Focused": "Concentrado",
    "trait.EasilyDistracted": "Distraído",
    "trait.TrackMemorizer": "Memorizador",
    "trait.RecoveryExpert": "Recuperador",
    "trait.SlowStarter": "Inicio lento",
    "trait.CrowdPleaser": "Animador",
    "trait.Stamina": "Aguante",
    "trait.Adaptable": "Adaptable",
    "trait.Competitive": "Competitivo",
    "trait.TemperatureSensitive": "Sensible a temperatura",
    "trait.Lucky": "Afortunado",
    "trait.FastFinisher": "Finalizador",
    "trait.Tactical": "Táctico",
    "trait.Fragile": "Frágil",
    "trait.ChampionBlood": "Sangre campeona",
    "trait.Underdog": "Desvalido",
    "trait.DarkHorse": "Sorpresivo",
    "trait.StrongFinisher": "Final potente",
    "trait.CrowdFavorite": "Favorito",
    "trait.IronHorse": "Caballo de hierro",
    "trait.NervousRunner": "Corredor nervioso",
    "trait.PoorStarter": "Mal inicio",
    "trait.MudRunner": "Corredor de lodo",
    "trait.LateBloomer": "Tardío",
    "trait.TrainingResistant": "Resistente al entrenamiento",
    "trait.Inconsistent": "Inconsistente",
    "trait.Temperamental": "Temperamental",
    "trait.SpotlightShy": "Tímido",
    "trait.LegendaryBloodline": "Linaje legendario",
    "trait.SixthSense": "Sexto sentido",
    "trait.PhoenixSpirit": "Espíritu fénix",
    "trait.HeartofGold": "Corazón de oro",
    "trait.SoulBond": "Vínculo del alma",
    "trait.TimeDilation": "Dilata el tiempo",
    "trait.MiracleWorker": "Milagroso",
    "trait.RiskTaker": "Arriesgado",
    "trait.Uninjurable": "Inquebrantable",
    "trait.ExtremeTraining": "Entrenamiento extremo",
    "trait.VeteranTactics": "Tácticas veteranas",
    
    // Trait descriptions - shortened for UI space
    "traitDesc.FastStarter": "Sale con rapidez impresionante.",
    "traitDesc.Endurance": "Mantiene rendimiento sin cansarse.",
    "traitDesc.Unpredictable": "A veces brillante, a veces decepcionante.",
    "traitDesc.Sprinter": "Destaca en explosiones breves de velocidad.",
    "traitDesc.Consistent": "Rara vez tiene malas carreras.",
    "traitDesc.MuddyTrackExpert": "Excelente en pistas mojadas o fangosas.",
    "traitDesc.Nervous": "Se inquieta por multitudes y ruido.",
    "traitDesc.WeatherSensitive": "Rendimiento varía según el clima.",
    "traitDesc.InjuryProne": "Tiende a lesionarse más fácilmente.",
    "traitDesc.LateCharger": "Suele remontar al final.",
    "traitDesc.Focused": "Mantiene concentración durante la carrera.",
    "traitDesc.EasilyDistracted": "Pierde foco en momentos críticos.",
    "traitDesc.TrackMemorizer": "Mejor en pistas familiares.",
    "traitDesc.RecoveryExpert": "Se recupera rápido después de las carreras.",
    "traitDesc.SlowStarter": "Tarda en alcanzar velocidad máxima.",
    "traitDesc.CrowdPleaser": "Mejor con gran audiencia.",
    "traitDesc.Stamina": "Mantiene alto rendimiento por más tiempo.",
    "traitDesc.Adaptable": "Se adapta rápido a condiciones cambiantes.",
    "traitDesc.Competitive": "Mejor cuando compite cabeza a cabeza.",
    "traitDesc.TemperatureSensitive": "Rendimiento varía según temperatura.",
    "traitDesc.Lucky": "A veces desafía probabilidades.",
    "traitDesc.FastFinisher": "Impresionante sprint final.",
    "traitDesc.Tactical": "Toma decisiones inteligentes de posición.",
    "traitDesc.Fragile": "Más susceptible a lesiones y fatiga.",
    "traitDesc.ChampionBlood": "Desciende de caballos ganadores.",
    "traitDesc.Underdog": "Rinde mejor de lo esperado.",
    "traitDesc.DarkHorse": "Sorprende cuando menos se espera.",
    "traitDesc.StrongFinisher": "Increíble resistencia en el tramo final.",
    "traitDesc.CrowdFavorite": "Amado por la audiencia.",
    "traitDesc.IronHorse": "Notable resistencia y aguante.",
    "traitDesc.NervousRunner": "Ansioso antes y durante carreras.",
    "traitDesc.PoorStarter": "Tarda en tomar ritmo.",
    "traitDesc.MudRunner": "Mejor en mal tiempo y pistas fangosas.",
    "traitDesc.LateBloomer": "Desarrolla fuerza más tarde en temporada.",
    "traitDesc.TrainingResistant": "No siempre responde bien al entrenamiento intensivo.",
    "traitDesc.Inconsistent": "Rendimiento varía impredeciblemente.",
    "traitDesc.Temperamental": "El humor afecta mucho su rendimiento.",
    "traitDesc.SpotlightShy": "No rinde bien cuando es favorito.",
    "traitDesc.LegendaryBloodline": "Descendiente de grandes campeones de la historia.",
    "traitDesc.SixthSense": "Parece anticipar obstáculos antes de que aparezcan.",
    "traitDesc.PhoenixSpirit": "Puede surgir del agotamiento de forma milagrosa.",
    "traitDesc.HeartofGold": "Muestra determinación increíble ante los desafíos.",
    "traitDesc.SoulBond": "Forma conexión profunda con su jinete.",
    "traitDesc.TimeDilation": "Parece entrar en un estado donde el tiempo se ralentiza.",
    "traitDesc.MiracleWorker": "Logra lo imposible cuando parece perdido.",
    "traitDesc.RiskTaker": "Este caballo prospera con el peligro y toma riesgos.",
    "traitDesc.Uninjurable": "Tiene constitución notable, evita lesiones.",
    "traitDesc.ExtremeTraining": "Sometido a entrenamientos que superan límites normales.",
    "traitDesc.VeteranTactics": "Años de experiencia le han enseñado a navegar carreras difíciles.",
    
    // Season History Translations
    "seasonHistory.viewButton": "Ver Historial de Temporada",
    "seasonHistory.title": "Historial de Temporada",
    "seasonHistory.noRaces": "No hay carreras completadas aún",
    "seasonHistory.race": "Carrera",
    
    // Race Results Translations
    "raceResults.title": "Resultados de Carrera",
    "raceResults.subtitle": "Posiciones finales y velocidades",
    "raceResults.yourHorse": "Tu Caballo",
    "raceResults.yourBet": "Tu Apuesta",
    
    // Toast Notifications
    "toast.success": "Éxito",
    "toast.error": "Error",
    "toast.info": "Info",
    "toast.warning": "Advertencia",
    
    // Race Events - Good outcomes (position <= 3)
    "raceEvent.injury.good": "Se esforzó demasiado y se lesionó a pesar de quedar bien",
    "raceEvent.stumble.good": "Se recuperó magníficamente de un tropiezo inicial",
    "raceEvent.burst.good": "Tuvo un impulso increíble de velocidad en el momento crítico",
    "raceEvent.tired.good": "Luchó contra la fatiga para asegurar su posición",
    "raceEvent.distracted.good": "Superó un momento de distracción",
    "raceEvent.perfect.good": "Corrió una carrera perfecta de principio a fin",
    "raceEvent.jockey.good": "El jinete tomó decisiones tácticas brillantes",
    "raceEvent.weather.good": "Se adaptó bien a condiciones climáticas difíciles",
    "raceEvent.comeback.good": "Hizo una remontada impresionante tras quedar atrás",
    "raceEvent.nervous.good": "Controló eficazmente los nervios previos a la carrera",
    "raceEvent.collision.good": "Navegó a través de una colisión y mantuvo el ritmo",
    "raceEvent.crowd.good": "Se alimentó de la energía del público",
    "raceEvent.miracle.good": "Realizó una carrera milagrosa más allá de las expectativas",
    
    // Race Events - Bad outcomes (position > 3)
    "raceEvent.injury.bad": "Sufrió una lesión durante la carrera",
    "raceEvent.stumble.bad": "Tropezó gravemente y no pudo recuperar posición",
    "raceEvent.burst.bad": "Tuvo un breve impulso de velocidad pero no pudo mantenerlo",
    "raceEvent.tired.bad": "Se cansó rápidamente y perdió terreno",
    "raceEvent.distracted.bad": "Se distrajo severamente en un momento crítico",
    "raceEvent.perfect.bad": "Comenzó perfectamente pero se desvaneció significativamente",
    "raceEvent.jockey.bad": "El jinete cometió un error táctico crítico",
    "raceEvent.weather.bad": "Luchó con las condiciones climáticas",
    "raceEvent.comeback.bad": "Intentó recuperarse pero no pudo compensar el terreno perdido",
    "raceEvent.nervous.bad": "Estuvo visiblemente nervioso durante toda la carrera",
    "raceEvent.collision.bad": "Quedó atrapado en el tráfico y perdió posición",
    "raceEvent.crowd.bad": "Se distrajo con el público rugiente",
    "raceEvent.miracle.bad": "Casi logró un final milagroso"
  }
};

// Provider Component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  
  const t = (key: string, fallback?: string): string => {
    const lang = language;
    // @ts-ignore
    const translation = translations[lang]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to English if the key exists there
    // @ts-ignore
    const englishTranslation = translations.en[key];
    if (englishTranslation) {
      return englishTranslation;
    }
    
    // Return fallback or key if no translation found
    return fallback || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
};
