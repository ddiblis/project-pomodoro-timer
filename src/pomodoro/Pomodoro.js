import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration, secondsToDuration } from "../utils/duration/index.js"

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [timer, setTimer] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [timerDisplay, setTimerDisplay] = useState("25:00")
  const [breakTimeDisplay, setBreakTimeDisplay] = useState("05:00")
  const [timeInSeconds, setTimeinSeconds] = useState(timer * 60)
  const [timeInSecondsDisplay, setTimeInSecondsDisplay] = useState(secondsToDuration(timeInSeconds))
  const [breakTimeInSeconds, setbreakTimeInSeconds] = useState(breakTime * 60)
  const [breakTimeInSecondsDisplay, setBreakTimeInSecondsDisplay] = useState(secondsToDuration(breakTimeInSeconds))
  const [valueNow, setValueNow] = useState(0)
  const [percentage, setPercentage] = useState(`${valueNow}%`)

  // const initialStates = {
  //   isTimerRunning: false,
  //   paused: false,
  //   stopped: false,
  //   timer: 25,
  //   breakTime: 5,
  //   timerDisplay: "25:00",
  //   breakTimerDisplay: "5:00",
  //   timeInSeconds: timer*60,
  //   timeInSecondsDisplay: secondsToDuration(timeInSeconds),
  //   breakTimeInSeconds: breakTime*60,
  //   breakTimeInSecondsDisplay: secondsToDuration(breakTimeInSeconds),
  //   valueNow: 0,
  //   percentage: `${valueNow}%`
  // }

  // const [timerData, setTimerData] = useState({...initialStates})

  // const handleChange = ({target}) => {
  //   return setTimerData({
  //         ...timerData,
  //         [target.name]: target.value
  //   })
  // }



  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    if (!isTimerRunning && !paused) {
      setTimeinSeconds(convertTimeToSeconds(timer))
      setbreakTimeInSeconds(convertTimeToSeconds(breakTime))
    }
    if (!isTimerRunning) setPaused(true)
    setStopped(false)
  }

  useInterval(
    () => {
      if (isTimerRunning && paused && timeInSeconds > 0) {
      const newTime = timeInSeconds - 1
      setTimeinSeconds(newTime)
      secondsTimerDisplay(newTime)
      timePercentage(newTime, timer)
      setPercentage(`${valueNow}%`)
      } 
      else if (breakTimeInSeconds > 0) {
        const newBreakTime = breakTimeInSeconds - 1
        setbreakTimeInSeconds(newBreakTime)
        secondsBreakDisplay(newBreakTime)
        timePercentage(newBreakTime, breakTime)
        setPercentage(`${valueNow}%`)
      }
      else {
        setTimer(timer)
        setBreakTime(breakTime)
        setTimeinSeconds(timer)
        setbreakTimeInSeconds(breakTime)
      }
    },
    isTimerRunning ? 1000 : null
  );

  const timerTimeDisplay = (time) => setTimerDisplay(minutesToDuration(time))
  const breakTimerDisplay = (time) => setBreakTimeDisplay(minutesToDuration(time))
  const secondsTimerDisplay = (time) => setTimeInSecondsDisplay(secondsToDuration(time))
  const secondsBreakDisplay = (time) => setBreakTimeInSecondsDisplay(secondsToDuration(time))
  const timePercentage = (currentTime, absoluteTime) => setValueNow(100 -(currentTime * 100) / (absoluteTime * 60))
  const convertTimeToSeconds = (time) => time * 60
  const disableButtons = isTimerRunning || paused

  const increaseTimerTime = () => {
    let newTime = Math.min(60, timer + 5)
    setTimer(newTime)
    timerTimeDisplay(newTime)
    secondsTimerDisplay(newTime)
  }

  const decreaseTimertime = () => {
    let newTime = timer - 5
    newTime = Math.max(5, newTime)
    setTimer(newTime)
    timerTimeDisplay(newTime)
    secondsTimerDisplay(newTime)
  }

  const increaseBreakTime = () => {
    let newTime = Math.min(15, breakTime + 1)
    setBreakTime(newTime)
    breakTimerDisplay(newTime)
    secondsBreakDisplay(newTime)
  }
  const decreaseBreakTime = () => {
    let newTime = Math.max(1, breakTime - 1)
    setBreakTime(newTime)
    breakTimerDisplay(newTime)
    secondsBreakDisplay(newTime)
  }

  const stopButton = () => {
    setStopped(true)
    setIsTimerRunning(false)
    setPaused(false)
  }

  const shouldDisable = (state) => state ? true : false

  const WhichTimer = () => timeInSeconds !== 0 ? (
        <div className="col">
          <h2 data-testid="session-title">Focusing for {timerDisplay} minutes</h2>
          <p className="lead" data-testid="session-sub-title">
            {timeInSecondsDisplay} remaining
            </p>
        </div>
) : (   <div className="col">
          <h2 data-testid="session-title">On Break for {breakTimeDisplay} minutes</h2>
          <p className="lead" data-testid="session-sub-title">
            {breakTimeInSecondsDisplay} remaining
            </p>
        </div>
    )

  const DisplayTimer = () => !stopped && paused && breakTimeInSeconds > 0 ? (
    <div>
      <div className="row mb-2">
        <WhichTimer />
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={valueNow} 
              style={{ width: percentage }} 
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
      <div>
      </div>)

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {timerDisplay}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={decreaseTimertime}
                disabled={shouldDisable(disableButtons)}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={increaseTimerTime}
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
                  onClick={decreaseBreakTime}
                  disabled={shouldDisable(disableButtons)}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={increaseBreakTime}
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
              title="Start or pause timer"
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
      <DisplayTimer />
    </div>
  );
}

export default Pomodoro;
