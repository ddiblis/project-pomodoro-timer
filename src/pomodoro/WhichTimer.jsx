import React from "react";
import {
  minutesToDuration,
  secondsToDuration,
} from "../utils/duration/index.js";

export default function WhichTimer(props) {
  const { breakTime, breakTimeInSeconds, focusTime, timeInSeconds } = props;

  // Conditional that chooses whether to display focus timer or break timer
  return timeInSeconds ? (
    <div className="col">
      <h2 data-testid="session-title">
        Focusing for {minutesToDuration(focusTime)} minutes
      </h2>
      <p className="lead" data-testid="session-sub-title">
        {secondsToDuration(timeInSeconds)} remaining
      </p>
    </div>
  ) : (
    <div className="col">
      <h2 data-testid="session-title">
        On Break for {minutesToDuration(breakTime)} minutes
      </h2>
      <p className="lead" data-testid="session-sub-title">
        {secondsToDuration(breakTimeInSeconds)} remaining
      </p>
    </div>
  );
}
