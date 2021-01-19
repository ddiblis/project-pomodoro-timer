import React from "react";
import WhichTimer from "./WhichTimer";

export default function DisplayTimer(props) {
  const {
    breakTimeInSecondsDisplay,
    timeInSecondsDisplay,
    breakTimeInSeconds,
    focusTimeDisplay,
    breakTimeDisplay,
    timeInSeconds,
    percentage,
    valueNow,
    stopped,
    paused,
  } = props;

  // Easier to have this entire area as a jsx fragment, that was it can be displayed or not based on conditionals
  return !stopped && paused && breakTimeInSeconds > 0 ? (
    <div>
      <div className="row mb-2">
        <WhichTimer
          breakTimeInSecondsDisplay={breakTimeInSecondsDisplay}
          timeInSecondsDisplay={timeInSecondsDisplay}
          focusTimeDisplay={focusTimeDisplay}
          breakTimeDisplay={breakTimeDisplay}
          timeInSeconds={timeInSeconds}
        />
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
    <div></div>
  );
}
