import React, {useState} from "react";

const TimeContext = React.createContext();

function TimeContextProvider(props) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [duration, setDuration] = useState(0);

    return (
        <TimeContext.Provider value={{
            elapsedTime: elapsedTime,
            setElapsedTime: setElapsedTime,
            duration: duration,
            setDuration: setDuration,
        }}>
            {props.children}
        </TimeContext.Provider>
    );
}

export {TimeContext, TimeContextProvider};