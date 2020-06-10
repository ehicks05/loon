import React, {useEffect, useRef, useState} from "react";
import superFetch from "./SuperFetch";
import {useThrottle} from '@react-hook/throttle'

const VolumeContext = React.createContext();

function VolumeContextProvider(props) {
    const userIdRef = useRef(0);
    const [volume, setVolume] = useState(null);
    const [volumeThrottled, setVolumeThrottled] = useThrottle(false, 1);

    useEffect(() => {
        fetchVolume();
    }, []);

    useEffect(() => {
        if (!volumeThrottled)
            return;

        const formData = new FormData();
        formData.append('volume', volumeThrottled);
        updateUser('/api/users/' + userIdRef, formData, true);
    }, [volumeThrottled])

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
        setVolumeThrottled(volume);
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