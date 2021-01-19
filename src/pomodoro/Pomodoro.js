import React, { useState } from "react";
import DisplayTimer from "./DisplayTimer"
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration, secondsToDuration } from "../utils/duration/index.js"

export default function Pomodoro() {
  // All managed States
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [paused, setPaused] = useState(false)
  const [focusTime, setfocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [focusTimeDisplay, setFocusTimeDisplay] = useState("25:00")
  const [breakTimeDisplay, setBreakTimeDisplay] = useState("05:00")
  const [breakTimeInSeconds, setbreakTimeInSeconds] = useState(breakTime * 60)
  const [timeInSeconds, setTimeinSeconds] = useState(focusTime * 60)
  const [breakTimeInSecondsDisplay, setBreakTimeInSecondsDisplay] = useState(secondsToDuration(breakTimeInSeconds))
  const [timeInSecondsDisplay, setTimeInSecondsDisplay] = useState(secondsToDuration(timeInSeconds))
  const [valueNow, setValueNow] = useState(0)
  const [percentage, setPercentage] = useState(`${valueNow}%`)

  // Generic functions to make it easier to call on certain changes multiple times
  const timePercentage = (currentTime, absoluteTime) => setValueNow(100 -(currentTime * 100) / (absoluteTime * 60))
  const secondsBreakDisplay = (time) => setBreakTimeInSecondsDisplay(secondsToDuration(time))
  const secondsTimerDisplay = (time) => setTimeInSecondsDisplay(secondsToDuration(time))
  const focusTimeTimeDisplay = (time) => setFocusTimeDisplay(minutesToDuration(time))
  const breakTimerDisplay = (time) => setBreakTimeDisplay(minutesToDuration(time))
  const shouldDisable = (state) => state ? true : false
  const convertTimeToSeconds = (time) => time * 60
  const disableButtons = isTimerRunning || paused

  // Button functions for increase and decrease
  // Focustimer buttons
  const FocusButtonIncrease = () => {
    let newTime = Math.min(60, focusTime + 5)
    setfocusTime(newTime)
    focusTimeTimeDisplay(newTime)
    secondsTimerDisplay(newTime)
  }

  const FocusButtonDecrease = () => {
    let newTime = Math.max(5, focusTime - 5)
    setfocusTime(newTime)
    focusTimeTimeDisplay(newTime)
    secondsTimerDisplay(newTime)
  }

  // Breaktimer Buttons
  const breaktimeButtonIncrease = () => {
    let newTime = Math.min(15, breakTime + 1)
    setBreakTime(newTime)
    breakTimerDisplay(newTime)
    secondsBreakDisplay(newTime)
  }
  const breaktimeButtondecrease = () => {
    let newTime = Math.max(1, breakTime - 1)
    setBreakTime(newTime)
    breakTimerDisplay(newTime)
    secondsBreakDisplay(newTime)
  }

  // Function for the play and pause button
  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    if (!isTimerRunning && !paused) {
      setTimeinSeconds(convertTimeToSeconds(focusTime))
      setbreakTimeInSeconds(convertTimeToSeconds(breakTime))
    }
    if (!isTimerRunning) setPaused(true)
    setStopped(false)
  }

  // stop Button function
  const stopButton = () => {
    setStopped(true)
    setIsTimerRunning(false)
    setPaused(false)
  }

  const runTimer = () => {
    if (isTimerRunning && paused && timeInSeconds > 0) {
    const newTime = timeInSeconds - 1
    setTimeinSeconds(newTime)
    secondsTimerDisplay(newTime)
    timePercentage(newTime, focusTime)
    setPercentage(`${valueNow}%`)
      if (newTime === 0) {
        new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();
      }
    } 
    else if (breakTimeInSeconds > 0) {
      const newBreakTime = breakTimeInSeconds - 1
      setbreakTimeInSeconds(newBreakTime)
      secondsBreakDisplay(newBreakTime)
      timePercentage(newBreakTime, breakTime)
      setPercentage(`${valueNow}%`)
      if (newBreakTime === 0) {
        new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();
      }
    }
    else {
      setfocusTime(focusTime)
      setBreakTime(breakTime)
      setTimeinSeconds(focusTime)
      setbreakTimeInSeconds(breakTime)
    }
  }

  // Main logic behind counter
  useInterval(
    () => {
      runTimer()
    },
    isTimerRunning ? 1000 : null
  );

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {focusTimeDisplay}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={FocusButtonDecrease}
                disabled={shouldDisable(disableButtons)}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={FocusButtonIncrease}
                disabled={shouldDisable(disableButtons)}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {breakTimeDisplay}
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={breaktimeButtondecrease}
                  disabled={shouldDisable(disableButtons)}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={breaktimeButtonIncrease}
                  disabled={shouldDisable(disableButtons)}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause focusTime"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={stopButton}
              disabled={!shouldDisable(isTimerRunning)}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <DisplayTimer 
        breakTimeInSecondsDisplay={breakTimeInSecondsDisplay}
        timeInSecondsDisplay={timeInSecondsDisplay}
        breakTimeInSeconds={breakTimeInSeconds}
        focusTimeDisplay={focusTimeDisplay}
        breakTimeDisplay={breakTimeDisplay}
        timeInSeconds={timeInSeconds}
        percentage={percentage}
        valueNow={valueNow}
        stopped={stopped}
        paused={paused}
        />
    </div>
  );
}