import {observable, computed, action} from 'mobx';

export class UiState {
    @observable user;
    @observable selectedPlaylistId;
    @observable selectedTrackId;
    @observable selectedContextMenuId;

    // .struct makes sure observer won't be signaled unless the
    // dimensions object changed in a deepEqual manner
    @observable windowDimensions = {
        width: 0,
        height: 0
    };

    constructor(rootStore) {
        this.rootStore = rootStore;

        const self = this;

        this.getWindowDimensions();
        window.addEventListener('resize', function(e) {
            if (typeof window === 'object') {
                self.windowDimensions.width = window.innerWidth;
                self.windowDimensions.height = window.innerHeight;
            }
        });

        this.loadUser();
    }

    @action
    getWindowDimensions(e) {
        if (typeof window === 'object') {
            this.windowDimensions.width = window.innerWidth;
            this.windowDimensions.height = window.innerHeight;
        }
    }

    @action
    loadUser()
    {
        const self = this;
        return fetch('/api/users/current', {method: 'GET'})
            .then(response => response.json()).then(data => {
                self.user = data;
                self.selectedPlaylistId = data.userState.lastPlaylistId;
                self.selectedTrackId = data.userState.lastTrackId;
            });
    }

    @action
    handleSelectedPlaylistIdChange(selectedPlaylistId, selectedTrackId)
    {
        this.selectedPlaylistId = selectedPlaylistId;
        this.selectedTrackId = selectedTrackId;
        const formData = new FormData();
        formData.append('lastPlaylistId', this.selectedPlaylistId);
        formData.append('lastTrackId', this.selectedTrackId);
        this.rootStore.myFetch('/api/users/' + this.user.id + '/saveProgress', {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    @action
    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.selectedTrackId = selectedTrackId;
        const self = this;
        const formData = new FormData();
        formData.append('lastPlaylistId', this.selectedPlaylistId);
        formData.append('lastTrackId', this.selectedTrackId);
        this.rootStore.myFetch('/api/users/' + this.user.id + '/saveProgress', {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    @action
    updateVolume(volume) {
        this.user.userState.volume = volume;

        const formData = new FormData();
        formData.append('volume', volume);
        this.rootStore.myFetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    updateMuted(muted) {
        this.user.userState.muted = muted;

        const formData = new FormData();
        formData.append('muted', muted);
        this.rootStore.myFetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    updateShuffle(shuffle) {
        this.user.userState.shuffle = shuffle;

        const formData = new FormData();
        formData.append('shuffle', shuffle);
        this.rootStore.myFetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @computed get selectedTrack() {
        return this.rootStore.appState.tracks && typeof this.rootStore.appState.tracks === 'object'?
            this.rootStore.appState.tracks.find(track => track.id === this.selectedTrackId) : null;
    }
}