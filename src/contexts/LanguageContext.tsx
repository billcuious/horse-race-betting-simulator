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
    "jockey.celebrity.title": "The Celebrity Jockey",
    "jockey.celebrity.desc": "Famous personality who brings in extra sponsorship money for every race.",
    "jockey.celebrity.effect": "Earn $300 bonus each race but only receive half of the prize money for top 3 placements.",
    "jockey.underhanded.title": "The Underhanded Jockey",
    "jockey.underhanded.desc": "Uses unorthodox methods and has suspicious betting strategies.",
    "jockey.underhanded.effect": "Earn $1000 when placing last, but loans have 40% higher interest. Your horse starts with -3 to all stats.",
    "jockey.slippery.title": "The Slippery Jockey",
    "jockey.slippery.desc": "Has a knack for sneaking into better positions than expected.",
    "jockey.slippery.effect": "20% chance to place one position higher each race (except for 1st place). Speed decreases 10% faster after races.",
    "jockey.oneshot.title": "The One Shot Jockey",
    "jockey.oneshot.desc": "Strategizes for a single, perfectly timed race in the season.",
    "jockey.oneshot.effect": "Race 10: +5 to all stats and +$1000 prize money. After: double stat decrease. Starts with -4 to all stats.",
    
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
    "horse.interest": "interest",
    "horse.totalDebt": "Total debt",
    "horse.loanInfo": "How do loans work?",
    "horse.loanDetails": "Loan Information",
    "horse.loanExplain1": "You can take a loan to get more money for betting and training. The loan amount is based on your current money.",
    "horse.loanExplain2": "The total loan amount will be deducted from your final money at the end of the season.",
    "horse.loanInterestNormal": "Interest rate: 25%",
    "horse.loanInterestUnderhanded": "Interest rate: 40%",
    "horse.loanInterestExplain": "The interest rate is 25% of your loan amount.",
    "horse.loanInterestExplainUnderhanded": "Your Underhanded Jockey increases interest to 40%.",
    "horse.confirmLoan": "Confirm Loan",
    "horse.loanDescription": "You're about to take a loan of ${{amount}}. This will need to be repaid at the end of the season. Proceed?",
    "horse.mildInjury": "Mild Injury",
    "horse.majorInjury": "Major Injury",
    "horse.interestNote": "Note: ${{interestAmount}} interest will be applied.",
    
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
    "raceEvent.miracle.bad": "Nearly pulled off a miracle finish",

    // Events
    "event.pendingMessage": "This event will be applied after the race.",
    
    // Event titles and descriptions
    "Famous Jockey Offer": "Famous Jockey Offer",
    "A famous jockey offers to race for you!": "A famous jockey offers to race for you!",
    "Pay $1800 to hire a famous jockey? This will greatly increase Speed (+10) but decrease Control (-15).": "Pay $1800 to hire a famous jockey? This will greatly increase Speed (+10) but decrease Control (-15).",
    
    "Horse Health Tonic": "Horse Health Tonic",
    "A special tonic that promises to increase your horse's endurance.": "A special tonic that promises to increase your horse's endurance.",
    "Pay $1200 for the tonic? This will increase Endurance (+8) but may slightly reduce Speed (-3).": "Pay $1200 for the tonic? This will increase Endurance (+8) but may slightly reduce Speed (-3).",
    
    "Luxury Stable Offer": "Luxury Stable Offer",
    "An opportunity to rent a premium stable for your horse.": "An opportunity to rent a premium stable for your horse.",
    "Pay $2000 for the luxury stable? Your horse will gain +5 Recovery and +5 Control.": "Pay $2000 for the luxury stable? Your horse will gain +5 Recovery and +5 Control.",
    
    "Local Sponsor Interest": "Local Sponsor Interest",
    "A local business wants to sponsor your horse.": "A local business wants to sponsor your horse.",
    "Accept the sponsorship deal? You'll receive $1500, but will need to race with their logo, reducing Control by -5.": "Accept the sponsorship deal? You'll receive $1500, but will need to race with their logo, reducing Control by -5.",
    
    "Experimental Training Regime": "Experimental Training Regime",
    "A cutting-edge training program that could transform your horse.": "A cutting-edge training program that could transform your horse.",
    "Pay $2500 for the program? It promises major gains (+8 to all stats) but comes with risks of injury.": "Pay $2500 for the program? It promises major gains (+8 to all stats) but comes with risks of injury.",
    
    "Charity Race Invitation": "Charity Race Invitation",
    "You've been invited to participate in a charity exhibition race.": "You've been invited to participate in a charity exhibition race.",
    "Pay $1000 to enter? You'll gain significant publicity and +10 Control from the experience.": "Pay $1000 to enter? You'll gain significant publicity and +10 Control from the experience.",
    
    "Speed Enhancement Offer": "Speed Enhancement Offer",
    "A trainer offers a special technique to boost your horse's speed.": "A trainer offers a special technique to boost your horse's speed.",
    "Pay $1500 for the speed enhancement? Your horse will gain +15 Speed but lose -10 Control.": "Pay $1500 for the speed enhancement? Your horse will gain +15 Speed but lose -10 Control.",
    
    "Recovery Expert": "Recovery Expert",
    "A specialist in equine recovery techniques offers their services.": "A specialist in equine recovery techniques offers their services.",
    "Pay $1300 for the recovery specialist? Your horse will gain +12 Recovery but may lose some training time (-4 Speed).": "Pay $1300 for the recovery specialist? Your horse will gain +12 Recovery but may lose some training time (-4 Speed).",
    
    "Private Track Access": "Private Track Access",
    "An opportunity to train on an exclusive private track.": "An opportunity to train on an exclusive private track.",
    "Pay $1800 for private track access? Your horse will gain +7 Speed and +7 Control from the specialized training.": "Pay $1800 for private track access? Your horse will gain +7 Speed and +7 Control from the specialized training.",
    
    "Bad Weather Forecast": "Bad Weather Forecast",
    "A storm is predicted for the next race.": "A storm is predicted for the next race.",
    "Pay $1100 for specialized wet-track training? This will increase your horse's Control (+8) in adverse conditions.": "Pay $1100 for specialized wet-track training? This will increase your horse's Control (+8) in adverse conditions.",
    
    "Small Fine": "Small Fine",
    "You received a minor fine for administrative issues.": "You received a minor fine for administrative issues.",
    "Sponsor Bonus": "Sponsor Bonus",
    "A sponsor has awarded you a bonus for good performance!": "A sponsor has awarded you a bonus for good performance!",
    "Equipment Upgrade": "Equipment Upgrade",
    "New equipment has slightly improved your horse's performance.": "New equipment has slightly improved your horse's performance.",
    "Minor Setback": "Minor Setback",
    "Some minor issues have affected your horse's training.": "Some minor issues have affected your horse's training.",
    "Lucky Find": "Lucky Find",
    "You found some money that someone left behind!": "You found some money that someone left behind!",
    "Favorable Odds": "Favorable Odds",
    "Betting odds have shifted in your favor, bringing in some extra cash.": "Betting odds have shifted in your favor, bringing in some extra cash.",
    "Training Accident": "Training Accident",
    "A minor accident during training has cost you some money.": "A minor accident during training has cost you some money.",
    "Unexpected Expense": "Unexpected Expense",
    "An unexpected equipment replacement has cost you money.": "An unexpected equipment replacement has cost you money.",
    "Generous Tip": "Generous Tip", 
    "Someone gave you a tip that paid off!": "Someone gave you a tip that paid off!",
    "Tax Audit": "Tax Audit",
    "A tax audit has resulted in you owing some back taxes.": "A tax audit has resulted in you owing some back taxes.",
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
    "jockey.celebrity.title": "El Jinete Celebridad",
    "jockey.celebrity.desc": "Personalidad famosa que atrae dinero extra de patrocinadores en cada carrera.",
    "jockey.celebrity.effect": "Gana $300 adicionales por carrera pero solo recibe la mitad del premio por posiciones 1-3.",
    "jockey.underhanded.title": "El Jinete Tramposo",
    "jockey.underhanded.desc": "Utiliza métodos poco ortodoxos y tiene estrategias de apuestas sospechosas.",
    "jockey.underhanded.effect": "Gana $1000 al quedar último, pero los préstamos tienen un 40% más de interés. Tu caballo comienza con -3 en todas las estadísticas.",
    "jockey.slippery.title": "La Jinete Escurridiza",
    "jockey.slippery.desc": "Tiene una habilidad para colarse en mejores posiciones de lo esperado.",
    "jockey.slippery.effect": "20% de probabilidad de subir una posición en cada carrera (excepto para el 1er lugar). La velocidad disminuye un 10% más rápido después de las carreras.",
    "jockey.oneshot.title": "El Jinete de Una Oportunidad",
    "jockey.oneshot.desc": "Planifica para una sola carrera perfectamente cronometrada en la temporada.",
    "jockey.oneshot.effect": "Carrera 10: +5 a todas las estadísticas y +$1000 de premio. Después: disminución doble de estadísticas. Comienza con -4 en todas las estadísticas.",
    
    // Traits
    "traits.title": "Cómo Afecta Esto a Tu Caballo",
    "trait.effectsPerformance": "affecta el rendimiento de este caballo.",
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
    "horse.interest": "interés",
    "horse.totalDebt": "Deuda total",
    "horse.loanInfo": "¿Cómo funcionan los préstamos?",
    "horse.loanDetails": "Información del Préstamo",
    "horse.loanExplain1": "Puedes tomar un préstamo para obtener más dinero para apostar y entrenar. El monto del préstamo se basa en tu dinero actual.",
    "horse.loanExplain2": "El monto total del préstamo se deducirá de tu dinero final al final de la temporada.",
    "horse.loanInterestNormal": "Tasa de interés: 25%",
    "horse.loanInterestUnderhanded": "Tasa de interés: 40%",
    "horse.loanInterestExplain": "La tasa de interés es del 25% del monto de tu préstamo.",
    "horse.loanInterestExplainUnderhanded": "Tu Jinete Tramposo aumenta el interés al 40%.",
    "horse.confirmLoan": "Confirmar Préstamo",
    "horse.loanDescription": "Estás a punto de tomar un préstamo de ${{amount}}. Deberá ser reembolsado al final de la temporada. ¿Proceder?",
    "horse.mildInjury": "Lesión Leve",
    "horse.majorInjury": "Lesión Grave",
    "horse.interestNote": "Nota: se aplicarán ${{interestAmount}} de interés.",
    
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
    "trait.DarkHorse": "Caballo negro",
    "trait.StrongFinisher": "Final fuerte",
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
    "trait.SoulBond": "Vínculo espiritual",
    "trait.TimeDilation": "Dilatación temporal",
    "trait.MiracleWorker": "Milagroso",
    "trait.RiskTaker": "Arriesgado",
    "trait.Uninjurable": "Indestructible",
    "trait.ExtremeTraining": "Entrenamiento extremo",
    "trait.VeteranTactics": "Tácticas veteranas",
    
    // Trait descriptions
    "traitDesc.FastStarter": "Este caballo sale de la puerta con notable velocidad.",
    "traitDesc.Endurance": "Puede mantener su rendimiento en largas distancias sin cansarse.",
    "traitDesc.Unpredictable": "A veces brillante, a veces decepcionante - nunca sabes qué esperar.",
    "traitDesc.Sprinter": "Destaca en explosiones cortas de velocidad.",
    "traitDesc.Consistent": "Raramente tiene malas carreras, tiende a rendir de manera constante.",
    "traitDesc.MuddyTrackExpert": "Rinde excepcionalmente bien en pistas mojadas o embarradas.",
    "traitDesc.Nervous": "Tiende a inquietarse con las multitudes y el ruido.",
    "traitDesc.WeatherSensitive": "Su rendimiento varía significativamente según las condiciones climáticas.",
    "traitDesc.InjuryProne": "Tiene historial de lesionarse más fácilmente que otros caballos.",
    "traitDesc.LateCharger": "A menudo viene desde atrás para terminar fuerte.",
    "traitDesc.Focused": "Mantiene la concentración durante toda la carrera.",
    "traitDesc.EasilyDistracted": "Puede perder el enfoque en momentos críticos.",
    "traitDesc.TrackMemorizer": "Rinde mejor en pistas familiares.",
    "traitDesc.RecoveryExpert": "Se recupera rápidamente después de las carreras.",
    "traitDesc.SlowStarter": "Tarda en alcanzar su velocidad máxima.",
    "traitDesc.CrowdPleaser": "Rinde mejor cuando hay una gran audiencia.",
    "traitDesc.Stamina": "Puede mantener un alto rendimiento durante períodos más largos.",
    "traitDesc.Adaptable": "Se adapta rápidamente a los cambios en las condiciones de la carrera.",
    "traitDesc.Competitive": "Rinde mejor cuando compite cabeza a cabeza con otros.",
    "traitDesc.TemperatureSensitive": "Su rendimiento varía según la temperatura.",
    "traitDesc.Lucky": "A veces desafía las probabilidades de manera sorprendente.",
    "traitDesc.FastFinisher": "Tiene una impresionante capacidad de sprint final.",
    "traitDesc.Tactical": "Parece tomar decisiones inteligentes de posicionamiento durante las carreras.",
    "traitDesc.Fragile": "Más susceptible a lesiones y fatiga.",
    "traitDesc.ChampionBlood": "Desciende de una línea de caballos ganadores.",
    "traitDesc.Underdog": "A menudo rinde mejor de lo que las estadísticas predicen.",
    "traitDesc.DarkHorse": "Tiende a sorprender a los competidores cuando menos se espera.",
    "traitDesc.StrongFinisher": "Tiene una resistencia increíble en el tramo final.",
    "traitDesc.CrowdFavorite": "El público ama a este caballo, aumentando su confianza.",
    "traitDesc.IronHorse": "Conocido por su notable resistencia y aguante.",
    "traitDesc.NervousRunner": "Se pone ansioso antes y durante las carreras.",
    "traitDesc.PoorStarter": "Tarda más que la mayoría en tomar impulso después de la salida.",
    "traitDesc.MudRunner": "Rinde mejor en mal tiempo y en condiciones de pista embarrada.",
    "traitDesc.LateBloomer": "Desarrolla fuerza y velocidad más tarde en la temporada.",
    "traitDesc.TrainingResistant": "No siempre responde bien a regímenes de entrenamiento intensivo.",
    "traitDesc.Inconsistent": "El rendimiento varía impredeciblemente de carrera a carrera.",
    "traitDesc.Temperamental": "El estado de ánimo puede afectar mucho el rendimiento en la carrera.",
    "traitDesc.SpotlightShy": "No rinde bien cuando es favorito para ganar.",
    "traitDesc.LegendaryBloodline": "Descendiente de los más grandes campeones en la historia de las carreras. Un don verdaderamente raro.",
    "traitDesc.SixthSense": "Este caballo parece anticipar obstáculos antes de que aparezcan. Verdaderamente extraordinario.",
    "traitDesc.PhoenixSpirit": "Puede resurgir del agotamiento de manera milagrosa.",
    "traitDesc.HeartofGold": "Muestra una increíble determinación frente a los desafíos.",
    "traitDesc.SoulBond": "Forma una conexión profunda con su jinete, mejorando el rendimiento.",
    "traitDesc.TimeDilation": "Parece entrar en un estado donde el tiempo mismo se ralentiza en momentos críticos.",
    "traitDesc.MiracleWorker": "Conocido por lograr lo imposible cuando toda esperanza parece perdida.",
    "traitDesc.RiskTaker": "Este caballo prospera con el peligro y toma oportunidades que otros caballos no se atreverían.",
    "traitDesc.Uninjurable": "Este caballo tiene una constitución notable, capaz de evitar lesiones que detendrían a otros.",
    "traitDesc.ExtremeTraining": "Este caballo se somete a un entrenamiento intenso que lleva al límite el rendimiento equino.",
    "traitDesc.VeteranTactics": "Años de experiencia han enseñado a este caballo a navegar incluso las carreras más desafiantes.",
    
    // Season History Translations
    "seasonHistory.viewButton": "Ver Historial de Temporada",
    "seasonHistory.title": "Historial de Temporada",
    "seasonHistory.noRaces": "Aún no hay carreras completadas",
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
    "raceEvent.injury.good": "Se esforzó demasiado y se lesionó a pesar de posicionarse bien",
    "raceEvent.stumble.good": "Se recuperó magníficamente de un tropiezo inicial",
    "raceEvent.burst.good": "Tuvo un impulso increíble de velocidad en el momento crítico",
    "raceEvent.tired.good": "Luchó contra la fatiga para asegurar su posición",
    "raceEvent.distracted.good": "Superó un momento de distracción",
    "raceEvent.perfect.good": "Corrió una carrera perfecta de principio a fin",
    "raceEvent.jockey.good": "El jinete tomó decisiones tácticas brillantes",
    "raceEvent.weather.good": "Se adaptó bien a las condiciones climáticas desafiantes",
    "raceEvent.comeback.good": "Hizo un regreso impresionante después de quedarse atrás",
    "raceEvent.nervous.good": "Controló eficazmente los nervios previos a la carrera",
    "raceEvent.collision.good": "Navegó a través de una colisión y mantuvo el ritmo",
    "raceEvent.crowd.good": "Se alimentó de la energía de la multitud",
    "raceEvent.miracle.good": "Realizó una carrera milagrosa más allá de todas las expectativas",
    
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
    "raceEvent.crowd.bad": "Se distrajo por la multitud rugiente",
    "raceEvent.miracle.bad": "Casi logró un final milagroso",

    // Events
    "event.pendingMessage": "Este evento se aplicará después de la carrera.",
    
    // Event titles and descriptions
    "Famous Jockey Offer": "Oferta de Jinete Famoso",
    "A famous jockey offers to race for you!": "¡Un jinete famoso se ofrece a correr para ti!",
    "Pay $1800 to hire a famous jockey? This will greatly increase Speed (+10) but decrease Control (-15).": "¿Pagar $1800 para contratar a un jinete famoso? Esto aumentará considerablemente la Velocidad (+10) pero disminuirá el Control (-15).",
    
    "Horse Health Tonic": "Tónico de Salud para Caballos",
    "A special tonic that promises to increase your horse's endurance.": "Un tónico especial que promete aumentar la resistencia de tu caballo.",
    "Pay $1200 for the tonic? This will increase Endurance (+8) but may slightly reduce Speed (-3).": "¿Pagar $1200 por el tónico? Esto aumentará la Resistencia (+8) pero puede reducir ligeramente la Velocidad (-3).",
    
    "Luxury Stable Offer": "Oferta de Establo de Lujo",
    "An opportunity to rent a premium stable for your horse.": "Una oportunidad para alquilar un establo premium para tu caballo.",
    "Pay $2000 for the luxury stable? Your horse will gain +5 Recovery and +5 Control.": "¿Pagar $2000 por el establo de lujo? Tu caballo ganará +5 de Recuperación y +5 de Control.",
    
    "Local Sponsor Interest": "Interés de Patrocinador Local",
    "A local business wants to sponsor your horse.": "Un negocio local quiere patrocinar a tu caballo.",
    "Accept the sponsorship deal? You'll receive $1500, but will need to race with their logo, reducing Control by -5.": "¿Aceptar el acuerdo de patrocinio? Recibirás $1500, pero tendrás que correr con su logo, reduciendo el Control en -5.",
    
    "Experimental Training Regime": "Régimen de Entrenamiento Experimental",
    "A cutting-edge training program that could transform your horse.": "Un programa de entrenamiento de vanguardia que podría transformar a tu caballo.",
    "Pay $2500 for the program? It promises major gains (+8 to all stats) but comes with risks of injury.": "¿Pagar $2500 por el programa? Promete grandes ganancias (+8 a todas las estadísticas) pero conlleva riesgos de lesión.",
    
    "Charity Race Invitation": "Invitación a Carrera Benéfica",
    "You've been invited to participate in a charity exhibition race.": "Has sido invitado a participar en una carrera de exhibición benéfica.",
    "Pay $1000 to enter? You'll gain significant publicity and +10 Control from the experience.": "¿Pagar $1000 para participar? Ganarás publicidad significativa y +10 de Control por la experiencia.",
    
    "Speed Enhancement Offer": "Oferta de Mejora de Velocidad",
    "A trainer offers a special technique to boost your horse's speed.": "Un entrenador ofrece una técnica especial para aumentar la velocidad de tu caballo.",
    "Pay $1500 for the speed enhancement? Your horse will gain +15 Speed but lose -10 Control.": "¿Pagar $1500 por la mejora de velocidad? Tu caballo ganará +15 de Velocidad pero perderá -10 de Control.",
    
    "Recovery Expert": "Experto en Recuperación",
    "A specialist in equine recovery techniques offers their services.": "Un especialista en técnicas de recuperación equina ofrece sus servicios.",
    "Pay $1300 for the recovery specialist? Your horse will gain +12 Recovery but may lose some training time (-4 Speed).": "¿Pagar $1300 por el especialista en recuperación? Tu caballo ganará +12 de Recuperación pero puede perder algo de tiempo de entrenamiento (-4 de Velocidad).",
    
    "Private Track Access": "Acceso a Pista Privada",
    "An opportunity to train on an exclusive private track.": "Una oportunidad para entrenar en una pista privada exclusiva.",
    "Pay $1800 for private track access? Your horse will gain +7 Speed and +7 Control from the specialized training.": "¿Pagar $1800 por el acceso a la pista privada? Tu caballo ganará +7 de Velocidad y +7 de Control del entrenamiento especializado.",
    
    "Bad Weather Forecast": "Pronóstico de Mal Tiempo",
    "A storm is predicted for the next race.": "Se predice una tormenta para la próxima carrera.",
    "Pay $1100 for specialized wet-track training? This will increase your horse's Control (+8) in adverse conditions.": "¿Pagar $1100 por entrenamiento especializado en pista mojada? Esto aumentará el Control de tu caballo (+8) en condiciones adversas.",
    
    "Small Fine": "Multa Pequeña",
    "You received a minor fine for administrative issues.": "Has recibido una multa menor por problemas administrativos.",
    "Sponsor Bonus": "Bono de Patrocinador",
    "A sponsor has awarded you a bonus for good performance!": "¡Un patrocinador te ha otorgado un bono por buen rendimiento!",
    "Equipment Upgrade": "Mejora de Equipo",
    "New equipment has slightly improved your horse's performance.": "El nuevo equipo ha mejorado ligeramente el rendimiento de tu caballo.",
    "Minor Setback": "Contratiempo Menor",
    "Some minor issues have affected your horse's training.": "Algunos problemas menores han afectado el entrenamiento de tu caballo.",
    "Lucky Find": "Hallazgo Afortunado",
    "You found some money that someone left behind!": "¡Has encontrado algo de dinero que alguien dejó atrás!",
    "Favorable Odds": "Probabilidades Favorables",
    "Betting odds have shifted in your favor, bringing in some extra cash.": "Las probabilidades de apuesta han cambiado a tu favor, trayendo algo de dinero extra.",
    "Training Accident": "Accidente de Entrenamiento",
    "A minor accident during training has cost you some money.": "Un accidente menor durante el entrenamiento te ha costado algo de dinero.",
    "Unexpected Expense": "Gasto Inesperado",
    "An unexpected equipment replacement has cost you money.": "Un reemplazo de equipo inesperado te ha costado dinero.",
    "Generous Tip": "Propina Generosa", 
    "Someone gave you a tip that paid off!": "¡Alguien te dio un consejo que dio resultado!",
    "Tax Audit": "Auditoría Fiscal",
    "A tax audit has resulted in you owing some back taxes.": "Una auditoría fiscal ha resultado en que debes algunos impuestos atrasados.",
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const translatedText = translations[language][key];
    if (!translatedText && fallback) {
      return fallback;
    }
    return translatedText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
