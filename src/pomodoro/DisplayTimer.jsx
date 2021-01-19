import React from "react";
import WhichTimer from "./WhichTimer";

export default function DisplayTimer(props) {
  const { breakTimeInSeconds, percentage, valueNow, stopped, paused } = props;

// Found it better to have this part of the code with 2 fragments, makes it easier to track the conditionals. 
  return !stopped && paused && breakTimeInSeconds > 0 ? (
    <div>
      <div className="row mb-2">
        <WhichTimer {...props} />
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={valueNow}
              className="progress-bar"
              role="progressbar"
              style={{ width: percentage }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <> </>
  );
}
