import React, { useState } from "react";
import DisplayTimer from "./DisplayTimer";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration/index.js";

export default function Pomodoro() {
  // All managed States
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoro, setPomodoro] = useState({
    stopped: false,
    paused: false,
    focusTime: 25,
    breakTime: 5,
    breakTimeInSeconds: 5 * 60,
    timeInSeconds: 25 * 60,
    valueNow: 0,
    percentage: `${0}%`,
  });

  const pushVar = (values) => {
    setPomodoro({ ...pomodoro, ...values });
  };
  const shouldDisable = (state) => (state ? true : false);
  const disableButtons = isTimerRunning || pomodoro.paused;

  // Breaktimer Buttons
  const tenaryButton = (operation, vars) => {
    let baseTime = vars ? pomodoro.breakTime : pomodoro.focusTime;
    let increment = vars ? 1 : 5;
    let [max, min] = vars ? [1, 15] : [5, 60];
    let newTime = operation
      ? Math.min(min, baseTime + increment)
      : Math.max(max, baseTime - increment);
    let newObj = vars
      ? {
          breakTime: newTime,
          breakTimeInSeconds: newTime * 60,
        }
      : {
          focusTime: newTime,
          timeInSeconds: newTime * 60,
        };
    pushVar(newObj);
  };

  // Function for the play and pause button
  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    if (!isTimerRunning && !pomodoro.paused) {
      pushVar({
        timeinSeconds: pomodoro.focusTime * 60,
        breakTimeInSeconds: pomodoro.breakTime * 60,
      });
    }
    if (!isTimerRunning) {
      pushVar({ paused: true, stopped: false });
    }
  }

  // stop Button function
  const stopButton = () => {
    setIsTimerRunning(false);
    pushVar({
      stopped: true,
      paused: false,
      timeInSeconds: pomodoro.focusTime * 60,
    });
  };

  // Main logic behind the timer
  const runTimer = () => {
    if (isTimerRunning && pomodoro.paused && pomodoro.timeInSeconds > 0) {
      const newTime = pomodoro.timeInSeconds - 1;
      pushVar({
        timeInSeconds: newTime,
        valueNow: 100 - (newTime * 100) / (pomodoro.focusTime * 60),
        percentage: `${pomodoro.valueNow}%`,
      });
      if (newTime === 0) {
        new Audio(
          `${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`
        ).play();
      }
    } else if (pomodoro.breakTimeInSeconds > 0) {
      const newBreakTime = pomodoro.breakTimeInSeconds - 1;
      pushVar({
        breakTimeInSeconds: newBreakTime,
        valueNow: 100 - (newBreakTime * 100) / (pomodoro.breakTime * 60),
        percentage: `${pomodoro.valueNow}%`,
      });
      if (newBreakTime === 0) {
        new Audio(
          `${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`
        ).play();
      }
    } else {
      pushVar({
        timeInSeconds: pomodoro.focusTime * 60,
        breakTimeInSeconds: pomodoro.breakTime * 60,
      });
    }
  };

  // Kept it clean as requested only adding one function
  useInterval(
    () => {
      runTimer();
    },
    isTimerRunning ? 1000 : null
  );

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {minutesToDuration(pomodoro.focusTime)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={() => tenaryButton(false, false)}
                disabled={shouldDisable(disableButtons)}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={() => tenaryButton(true, false)}
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
                Break Duration: {minutesToDuration(pomodoro.breakTime)}
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => tenaryButton(false, true)}
                  disabled={shouldDisable(disableButtons)}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => tenaryButton(true, true)}
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
      <DisplayTimer {...pomodoro} />
    </div>
  );
}
