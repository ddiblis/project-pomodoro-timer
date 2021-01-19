import React from "react";
import WhichTimer from "./WhichTimer";

export default function DisplayTimer(props) {
  const { breakTimeInSeconds, percentage, valueNow, stopped, paused } = props;

  // Easier to have this entire area as a jsx fragment, that was it can be displayed or not based on conditionals
  if (!stopped && paused && breakTimeInSeconds > 0) {
    return (
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
    );
  } else {
    return <> </>
  }
}
