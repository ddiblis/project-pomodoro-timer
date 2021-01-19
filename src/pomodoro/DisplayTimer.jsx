import React from "react"
import WhichTimer from "./WhichTimer"

export default function DisplayTimer(props) {
    const { timeInSeconds, focusTimeDisplay, timeInSecondsDisplay, breakTimeDisplay, breakTimeInSecondsDisplay, valueNow, percentage, stopped, paused, breakTimeInSeconds } = props

    return (!stopped && paused && breakTimeInSeconds > 0 ? (
        <div>
            <div className="row mb-2">
                <WhichTimer timeInSeconds={timeInSeconds} focusTimeDisplay={focusTimeDisplay} timeInSecondsDisplay={timeInSecondsDisplay} breakTimeDisplay={breakTimeDisplay} breakTimeInSecondsDisplay={breakTimeInSecondsDisplay} />
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
            </div>))
}