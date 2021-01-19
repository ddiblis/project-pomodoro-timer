import React from "react"

export default function WhichTimer(props){
    const { timeInSeconds, focusTimeDisplay, timeInSecondsDisplay, breakTimeDisplay, breakTimeInSecondsDisplay } = props

    return (timeInSeconds !== 0 ? (
        <div className="col">
          <h2 data-testid="session-title">Focusing for {focusTimeDisplay} minutes</h2>
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
    ))
}