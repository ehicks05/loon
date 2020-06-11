import React, {useEffect, useRef, useState} from "react";
import superFetch from "./SuperFetch";
import useDebounce from "./UseDebounce";

const VolumeContext = React.createContext();

function VolumeContextProvider(props) {
    const userIdRef = useRef(0);
    const [volume, setVolume] = useState(-30);
    const volumeDebounced = useDebounce(volume, 1000);

    useEffect(() => {
        fetchVolume();
    }, []);

    useEffect(() => {
        const formData = new FormData();
        formData.append('volume', volumeDebounced);
        superFetch('/api/users/' + userIdRef.current, {method: 'PUT', body: formData});
    }, [volumeDebounced])

    function fetchVolume() {
        fetch('/api/users/current', {method: 'GET'})
            .then(response => response.json())
            .then(user => {
                userIdRef.current = user.id;
                setVolume(user.userState.volume);
            });
    }

    return (
        <VolumeContext.Provider value={{
            volume: volume,
            setVolume: setVolume,
        }}>
            {props.children}
        </VolumeContext.Provider>
    );
}

export {VolumeContext, VolumeContextProvider};