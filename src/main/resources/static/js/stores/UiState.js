import {observable, computed, action} from 'mobx';

export class UiState {
    @observable language = "en_US";
    @observable theme;
    @observable user;
    @observable selectedPlaylistId;
    @observable selectedTrackId;
    @observable selectedContextMenuId;
    @observable pendingRequestCount = 0;

    // .struct makes sure observer won't be signaled unless the
    // dimensions object changed in a deepEqual manner
    @observable screenDimensions = {
        width: 0,
        height: 0
    };

    @observable windowDimensions = {
        width: 0,
        height: 0
    };

    constructor(rootStore) {
        this.rootStore = rootStore;

        const self = this;
        this.getScreenDimensions();
        window.addEventListener('resize', function(e) {
            if (typeof window === 'object') {
                self.screenDimensions.width = window.screen.availWidth;
                self.screenDimensions.height = window.screen.availHeight;
            }
        });

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
    getScreenDimensions(e) {
        if (typeof window === 'object') {
            this.screenDimensions.width = window.screen.availWidth;
            this.screenDimensions.height = window.screen.availHeight;
        }
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
                self.theme = data.userState.theme;
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

    @action
    updateTranscode(transcode) {
        this.user.userState.transcode = transcode;

        const formData = new FormData();
        formData.append('transcode', transcode);
        this.rootStore.myFetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    updateEq(eqNum, field, value) {
        const prop = 'eq' + eqNum + field;
        this.user.userState[prop] = value;

        const formData = new FormData();
        formData.append('eqNum', eqNum);
        formData.append('field', field);
        formData.append('value', value);
        this.rootStore.myFetch('/api/users/' + this.user.id + '/eq', {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    toggleDarkTheme() {
        const self = this;
        self.rootStore.myFetch('/api/users/' + this.user.id + '/toggleDarkTheme', {method: 'PUT'})
            .then(response => self.loadUser());
    }

    @computed get themeUrl() {
        let theme = this.theme;
        if (!theme)
            theme = 'default';

        if (theme === 'default')
            return 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.min.css';
        if (theme === 'cyborg')
            return 'https://unpkg.com/bulma-dark@0.0.2/dist/css/cyborg.css';
    }

    @computed get selectedTrack() {
        return this.rootStore.appState.tracks && typeof this.rootStore.appState.tracks === 'object'?
            this.rootStore.appState.tracks.find(track => track.id === this.selectedTrackId) : null;
    }

    @computed get isDarkTheme() {
        return ['cyborg', 'darkly', 'nuclear', 'slate', 'solar', 'superhero',].includes(this.theme);
    }

    @computed get appIsInSync() {
        return this.pendingRequestCount === 0
    }
}