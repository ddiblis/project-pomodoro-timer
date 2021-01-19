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

  // Breaktimer Buttons, because I wanted const, instead of let ourside of the if, and set inside
  const tenaryButton = (operation, vars) => {
    const baseTime = vars ? pomodoro.breakTime : pomodoro.focusTime;
    const increment = vars ? 1 : 5;
    const [max, min] = vars ? [1, 15] : [5, 60];
    const newTime = operation
      ? Math.min(min, baseTime + increment)
      : Math.max(max, baseTime - increment);
    const newObj = vars
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
  // You only have yourself to blame, I learned it from watching you dad
  function playPause() {
    const newObj = !isTimerRunning
      ? { paused: true, stopped: false }
      : !isTimerRunning && !pomodoro.paused
      ? {
          timeinSeconds: pomodoro.focusTime * 60,
          breakTimeInSeconds: pomodoro.breakTime * 60,
        }
      : { ...pomodoro };
    pushVar(newObj);
    setIsTimerRunning((prevState) => !prevState);
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
    const newTime = pomodoro.timeInSeconds - 1;
    const newBreakTime = pomodoro.breakTimeInSeconds - 1;
    const runAudio = !newTime | !newBreakTime ? true : false;
    const newObj =
      isTimerRunning && pomodoro.paused && pomodoro.timeInSeconds > 0
        ? {
            timeInSeconds: newTime,
            valueNow: 100 - (newTime * 100) / (pomodoro.focusTime * 60),
            percentage: `${pomodoro.valueNow}%`,
          }
        : pomodoro.breakTimeInSeconds > 0
        ? {
            breakTimeInSeconds: newBreakTime,
            valueNow: 100 - (newBreakTime * 100) / (pomodoro.breakTime * 60),
            percentage: `${pomodoro.valueNow}%`,
          }
        : {
            timeInSeconds: pomodoro.focusTime * 60,
            breakTimeInSeconds: pomodoro.breakTime * 60,
          };
    pushVar(newObj);
    if (runAudio) {
      new Audio(
        `${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`
      ).play();
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
