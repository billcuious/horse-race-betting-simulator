
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define language types
export type Language = "en" | "es";

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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
    
    // Game progress
    "progress.title": "Season Progress",
    "progress.race": "Race {{current}} of {{total}}",
    
    // Horse stats
    "stats.speed": "Speed",
    "stats.control": "Control",
    "stats.recovery": "Recovery",
    "stats.endurance": "Endurance",
    "stats.outdated": "Stats may be outdated",
    "stats.traits": "Traits",
    
    // Scouting
    "scout.button": "Scout",
    "scout.basic": "Basic Scout",
    "scout.deep": "Deep Scout",
    
    // Betting
    "betting.title": "Place Your Bet",
    "betting.select": "Select a horse to place your bet",
    "betting.amount": "Bet Amount",
    "betting.place": "Place Bet",
    "betting.start": "Start Race",
    "betting.noSelection": "Select a horse first",
    "betting.max": "Max",
    
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
    "language.spanish": "Spanish"
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
    
    // Game progress
    "progress.title": "Progreso de Temporada",
    "progress.race": "Carrera {{current}} de {{total}}",
    
    // Horse stats
    "stats.speed": "Velocidad",
    "stats.control": "Control",
    "stats.recovery": "Recuperación",
    "stats.endurance": "Resistencia",
    "stats.outdated": "Las estadísticas pueden estar desactualizadas",
    "stats.traits": "Rasgos",
    
    // Scouting
    "scout.button": "Explorar",
    "scout.basic": "Exploración Básica",
    "scout.deep": "Exploración Profunda",
    
    // Betting
    "betting.title": "Haz Tu Apuesta",
    "betting.select": "Selecciona un caballo para hacer tu apuesta",
    "betting.amount": "Monto de Apuesta",
    "betting.place": "Hacer Apuesta",
    "betting.start": "Iniciar Carrera",
    "betting.noSelection": "Selecciona un caballo primero",
    "betting.max": "Máximo",
    
    // Results
    "results.title": "Últimos Resultados",
    "results.race": "Carrera {{number}}",
    "results.view": "Ver Resultados Completos",
    "results.you": "(Tú)",
    
    // Race positions
    "position.1": "1ro",
    "position.2": "2do",
    "position.3": "3ro",
    
    // Bet warning
    "betWarning.title": "No Se Ha Realizado Apuesta",
    "betWarning.description": "Has seleccionado a {{horseName}} pero no has realizado una apuesta todavía.",
    "betWarning.question": "¿Te gustaría hacer una apuesta antes de que comience la carrera?",
    "betWarning.max": "Máximo:",
    "betWarning.continue": "Continuar Sin Apostar",
    "betWarning.placeBet": "Apostar e Iniciar Carrera",
    
    // Race progress
    "race.progress": "Carrera en Progreso...",
    "race.description": "¡Los caballos están galopando en la pista!",
    
    // Game end
    "end.seasonOver": "¡Temporada Finalizada!",
    "end.win": "¡Felicidades! ¡Has alcanzado tu objetivo financiero!",
    "end.lose": "Mejor suerte en la próxima temporada. No alcanzaste tu objetivo financiero.",
    "end.loan": "Préstamo Pendiente:",
    "end.netWorth": "Valor Neto:",
    "end.finalStats": "Estadísticas Finales del Caballo:",
    "end.playAgain": "Jugar de Nuevo",
    
    // Buttons and common actions
    "action.cancel": "Cancelar",
    "action.confirm": "Confirmar",
    "action.accept": "Aceptar",
    "action.decline": "Rechazar",
    
    // Languages
    "language.english": "Inglés",
    "language.spanish": "Español"
  }
};

// Provider component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  
  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
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
