
interface GameHeaderProps {
  currentRace: number;
  totalRaces: number;
  playerMoney: number;
  seasonGoal: number;
}

const GameHeader = ({ currentRace, totalRaces, playerMoney, seasonGoal }: GameHeaderProps) => {
  return (
    <header className="bg-racing-green text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Horse Racing Simulator</h1>
          <p className="text-sm opacity-80">Season {currentRace} of {totalRaces}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm opacity-80">Money</p>
            <p className="font-bold">${playerMoney.toLocaleString()}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-80">Goal</p>
            <p className="font-bold">${seasonGoal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
