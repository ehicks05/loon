import React, {useEffect, useState} from "react";
import superFetch from "./SuperFetch";

const UserContext = React.createContext();

function UserContextProvider(props) {
    const[user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    function fetchUser() {
        fetch('/api/users/current', {method: 'GET'})
            .then(response => response.json())
            .then(data => setUser(data));
    }

    function updateUser(url, formData)
    {
        const options = {
            method: 'PUT',
            body: formData,
        }

        superFetch(url, options)
            .then(fetchUser);
    }

    function setSelectedPlaylistId(selectedPlaylistId, selectedTrackId) {
        const formData = new FormData();
        formData.append('lastPlaylistId', selectedPlaylistId);
        formData.append('lastTrackId', selectedTrackId);
        updateUser('/api/users/' + this.user.id + '/saveProgress', formData);
    }

    function setSelectedTrackId(selectedTrackId) {
        const formData = new FormData();
        formData.append('lastPlaylistId', user.userState.lastPlaylistId);
        formData.append('lastTrackId', selectedTrackId);
        updateUser('/api/users/' + this.user.id + '/saveProgress', formData);
    }

    function setVolume(volume) {
        const formData = new FormData();
        formData.append('volume', volume);
        updateUser('/api/users/' + this.user.id, formData);
    }

    function setMuted(muted) {
        const formData = new FormData();
        formData.append('muted', muted);
        updateUser('/api/users/' + this.user.id, formData);
    }

    function setShuffle(shuffle) {
        const formData = new FormData();
        formData.append('shuffle', shuffle);
        updateUser('/api/users/' + this.user.id, formData);
    }

    function setTranscode(transcode) {
        const formData = new FormData();
        formData.append('transcode', transcode);
        updateUser('/api/users/' + this.user.id, formData);
    }

    function setEq(eqNum, field, value) {
        const formData = new FormData();
        formData.append('eqNum', eqNum);
        formData.append('field', field);
        formData.append('value', value);
        updateUser('/api/users/' + this.user.id + '/eq', formData);
    }

    return (
        <UserContext.Provider value={{
            user: user,
            setUser: setUser, // todo this may not be needed if we only intend to update user through fetching it from back end
            fetchUser: fetchUser,
            setSelectedPlaylistId: setSelectedPlaylistId,
            setSelectedTrackId: setSelectedTrackId,
            setVolume: setVolume,
            setMuted: setMuted,
            setShuffle: setShuffle,
            setTranscode: setTranscode,
            setEq: setEq,
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export {UserContext, UserContextProvider};