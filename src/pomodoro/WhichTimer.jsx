import React from "react";
import {
  minutesToDuration,
  secondsToDuration,
} from "../utils/duration/index.js";

export default function WhichTimer(props) {
  const {
    timeInSeconds,
  } = props;

  // Conditional that chooses whether to display focus timer or break timer
  if (timeInSeconds !== 0) {
    return (
    <div className="col">
      <h2 data-testid="session-title">
        Focusing for {minutesToDuration(props.focusTime)} minutes
      </h2>
      <p className="lead" data-testid="session-sub-title">
        {secondsToDuration(props.timeInSeconds)} remaining
      </p>
    </div>
    )
   } 
   else { return (
    <div className="col">
      <h2 data-testid="session-title">
        On Break for {minutesToDuration(props.breakTime)} minutes
      </h2>
      <p className="lead" data-testid="session-sub-title">
        {secondsToDuration(props.breakTimeInSeconds)} remaining
      </p>
    </div>
  );
   }
}
