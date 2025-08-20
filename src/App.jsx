import React from "react"
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { languages } from "./languages.js"
import clsx from "clsx";
import { getFarewellText, chooseRandom } from "./utils.js"
import Confetti from "react-confetti"
import { useWindowSize } from 'react-use';

function App() {
  const { width, height } = useWindowSize();
  const numGuessesLeft = languages.length - 1;
  const [currentWord, setCurrentWord] = React.useState(chooseRandom());
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const [clicked, setClicked] = React.useState([]);
  const lastGuessedLetter = clicked[clicked.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  const wrongGuessCount = clicked.filter(ele => !currentWord.includes(ele)).length;
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameWon = currentWord.split("").every(ele => clicked.includes(ele))
  const isGameOver = isGameWon || isGameLost;
  function newGame() {
    setClicked([]);
    setCurrentWord(chooseRandom())
  }
  const arrayLang = languages.map((ele, index) => (
    {
      name: ele.name,
      backgroundColor: ele.backgroundColor,
      color: ele.color,
    }
  ));


  const buttons = arrayLang.map((ele, index) => {
    const isLost = index < wrongGuessCount;
    return (
      <div
        className={clsx("langDiv", isLost && "lost")}
        key={index}
        style={{
          color: ele.color,
          backgroundColor: ele.backgroundColor
        }}>
        {ele.name}
      </div>
    )
  })
  const word = currentWord.split("").map((letter, index) => {
    const isMissing = isGameLost && !clicked.includes(letter);
    const isRevealed = isMissing || clicked.includes(letter);
    return (
    <span
      key={index}
      className={clsx("word",isMissing && "missing",isGameLost && "explode" )}>
      {isRevealed ? letter.toUpperCase() : " "}
    </span>
    )
  })




  const textBox = alphabet.split("").map((letter, index) => {
    const isGuessed = clicked.includes(letter);
    const correct = isGuessed && currentWord.includes(letter);
    const wrong = isGuessed && !currentWord.includes(letter);
    return (
      <button
        key={letter}
        className={clsx(
          "text",
          correct && 'textC',
          wrong && 'textW')}
        disabled={isGameOver}
        aria-disabled={clicked.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => clickedLetters(letter)}>
        {letter.toUpperCase()}
      </button>
    )
  })

  function clickedLetters(letter) {
    setClicked(prevClicked => (
      prevClicked.includes(letter) ? prevClicked : [...prevClicked, letter]
    ))
  }

  let wlText = null;

  if (isGameOver) {
    if (isGameWon) {
      wlText = (
        <>
          <p>You Win!</p>
          <p className="h2">Well done! 🎉</p>
        </>
      );
    } else {
      wlText = (
        <>
          <p>Game Over!</p>
          <p className="h2">You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
  }
  else if (!isGameOver && isLastGuessIncorrect) {
    wlText = <p className="farewell">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
  }
  const gameStatus = clsx("bottom", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })
  return (
    <main>
      {isGameWon && <Confetti width={width} height={height} />}
      <div className="container">
        <div className="top">
          Assembly: Endgame
        </div>
        <div className="middle">
          Guess the word in under 8 attempts to keep the programming world safe from Assembly!
        </div>
        <div
          className={gameStatus}
          aria-live="polite"
          role="status">
          {wlText}
        </div>
      </div>
      <div className='languages'>
        {buttons}
      </div>
      <section className="wordContainer">
        {word}
      </section>
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter) ?
            `Correct! The letter ${lastGuessedLetter} is in the word.` :
            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          clicked.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>

      </section>
      <section className="textBox">
        {textBox}
      </section>
      {<button
        className="new-game"
        onClick={() => newGame()}
      >New Game</button>}
    </main>
  )
}

export default App
