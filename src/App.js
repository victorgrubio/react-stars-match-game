import React, { useEffect } from 'react';
import './App.css';

const StarsDisplay = props => (
  <>
  {utils.range(1, props.count).map(startId => 
      <div key={startId} className="star" />
    )}
  </>
)

const PlayNumber = props => (
  <button 
    className="number"
    style={{background: colors[props.status]}}
    onClick={() => props.onClick(props.number, props.status)}>
    {props.number}
  </button>
);

const PlayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{color: props.gameStatus === 'won' ? 'green' : 'red'}}
    >
      {props.gameStatus === 'won' ? 'You have won!' : 'Game Over'}
    </div>
    <button onClick={props.onClick}>
      Play Again!
    </button>
  </div>
);

// Custom hook that manages the game
const useGameState = timeLimit => {

  /* Definition states */
  const [stars, setStars] = React.useState(utils.random(1, 9));
  const [availableNums, setAvalailableNums] = React.useState(utils.range(1, 9))
  const [candidateNums, setCandidateNums] = React.useState([])
  const [secondsLeft, setSecondsLeft] = React.useState(10)

  /* Use effect function */
  useEffect(() => {
    // Use timer if the game is active only
    if (secondsLeft > 0 && availableNums.length > 0 ){
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidateNums) => {
    // checks if the sum of numbers is equal to the stars
    if (utils.sum(newCandidateNums) !== stars){
      // if it isn't add new candidate
      setCandidateNums(newCandidateNums)
    } else {
      // if it is clear the available numbs
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      )
      // set starts to a random sum from availableNumbers
      setStars(utils.randomSumIn(newAvailableNums, 9));
      // update available numbers
      setAvalailableNums(newAvailableNums);
      // clear candidates
      setCandidateNums([])
    }
  }
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
}



const Game = (props) => {

  /* Now all the state data comes from the Manager hook */
  const {
    stars,
    availableNums,
    candidateNums,
    secondsLeft,
    setGameState,
  } = useGameState();

  /* Constants for the app */
  // Our candidate numbers are wrong if its sum is greater
  // than the number of stars
  const candidatesAreWrong = utils.sum(candidateNums) > stars;

  // Checks status: first check if counter is finished then 
  // checks if we have any available num
  const gameStatus = secondsLeft === 0 ? 'lost' :
    availableNums.length === 0 ? 'won' : 'active'

  /* Common app functions */
  // We have to get the status for each number
  const numberStatus = (number) => {
    if(!availableNums.includes(number))
      return 'used'
    if(candidateNums.includes(number))
      return candidatesAreWrong ? 'wrong' : 'candidate'
    return 'available'
  }

  // Clicking function for numbers
  const onNumberClick = (number, currentStatus) => {
    // If it has been used and we can play, return
    if (currentStatus === 'used' || secondsLeft === 0){
      return ; 
    }
    // new candidates number: If it is available then concat
    // else: filter if the candidate num is not in candidates to remove it
    const newCandidateNums = 
      currentStatus === 'available' 
      ? candidateNums.concat(number)
      : candidateNums.filter(candidateNumber => candidateNumber !== number)
    
      // Updates the game's state with the new candidate numbers
      setGameState(newCandidateNums);
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
          <PlayAgain 
          onClick={props.startNewGame}
          gameStatus={gameStatus}
          />) : (
           <StarsDisplay count={stars} />
           )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => 
            <PlayNumber 
            key={number}
            status={numberStatus(number)}
            number={number}
            onClick={onNumberClick}
           />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const App = () => {
  
  const [gameId, setGameId] = React.useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default App;
