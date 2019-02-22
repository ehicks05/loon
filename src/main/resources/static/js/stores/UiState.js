import {observable, computed, action} from 'mobx';

export class UiState {
    @observable language = "en_US";
    @observable theme;
    @observable user;
    @observable selectedPlaylistId;
    @observable selectedTrackId;
    @observable selectedContextMenuTrackId;
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
            self.screenDimensions.width = window.screen.availWidth;
            self.screenDimensions.height = window.screen.availHeight;
        });

        this.getWindowDimensions();
        window.addEventListener('resize', function(e) {
            self.windowDimensions.width = window.innerWidth;
            self.windowDimensions.height = window.innerHeight;
        });

        this.loadTheme();
        this.loadUser();
    }

    @action
    getScreenDimensions(e) {
        this.screenDimensions.width = window.screen.availWidth;
        this.screenDimensions.height = window.screen.availHeight;
    }

    @action
    getWindowDimensions(e) {
        this.windowDimensions.width = window.innerWidth;
        this.windowDimensions.height = window.innerHeight;
    }

    @action
    loadTheme() {
        return fetch('/api/systemSettings/theme', {method: 'GET'})
            .then(response => response.text())
            .then(data => this.theme = data);
    }

    @action
    loadUser()
    {
        return fetch('/api/users/current', {method: 'GET'})
            .then(response => response.json()).then(data => {

                this.user = data;
                this.selectedPlaylistId = data.userState.lastPlaylistId;
                this.selectedTrackId = data.userState.lastTrackId;
            });
    }

    @action
    handleSelectedPlaylistIdChange(selectedPlaylistId, selectedTrackId)
    {
        this.selectedPlaylistId = selectedPlaylistId;
        this.selectedTrackId = selectedTrackId;
    }

    @action
    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.selectedTrackId = selectedTrackId;

        const formData = new FormData();
        formData.append('lastPlaylistId', this.selectedPlaylistId);
        formData.append('lastTrackId', this.selectedTrackId);
        fetch('/api/users/' + this.user.id + '/saveProgress', {method: 'PUT', body: formData})
            .then(response => response.json())
            .then(this.loadUser);
    }

    @action
    updateVolume(volume) {
        this.user.userState.volume = volume;

        const formData = new FormData();
        formData.append('volume', volume);
        fetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    updateMuted(muted) {
        this.user.userState.muted = muted;

        const formData = new FormData();
        formData.append('muted', muted);
        fetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @action
    updateShuffle(shuffle) {
        this.user.userState.shuffle = shuffle;

        const formData = new FormData();
        formData.append('shuffle', shuffle);
        fetch('/api/users/' + this.user.id, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {console.log(data);});
    }

    @computed get themeUrl() {
        let theme = this.theme;
        if (!theme)
            theme = 'default';

        return 'https://unpkg.com/bulmaswatch/' + theme + '/bulmaswatch.min.css';
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