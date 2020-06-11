import React, {useEffect, useRef, useState} from "react";
import superFetch from "./SuperFetch";
import useDebounce from "./UseDebounce";

const VolumeContext = React.createContext();

function VolumeContextProvider(props) {
    const userIdRef = useRef(0);
    const [volume, setVolume] = useState(null);
    const volumeDebounced = useDebounce(volume, 1000);

    useEffect(() => {
        fetchVolume();
    }, []);

    useEffect(() => {
        if (!volumeDebounced)
            return;

        const formData = new FormData();
        formData.append('volume', volumeDebounced);
        updateUser('/api/users/' + userIdRef.current, formData, true);
    }, [volumeDebounced])

    function fetchVolume() {
        fetch('/api/users/current', {method: 'GET'})
            .then(response => response.json())
            .then(user => {
                userIdRef.current = user.id;
                setVolume(user.userState.volume);
            });
    }

    function updateUser(url, formData) {
        superFetch(url, {method: 'PUT', body: formData});
    }

    function handleSetVolume(volume) {
        setVolume(volume);
    }

    return (
        <VolumeContext.Provider value={{
            volume: volume,
            setVolume: handleSetVolume,
        }}>
            {props.children}
        </VolumeContext.Provider>
    );
}

export {VolumeContext, VolumeContextProvider};