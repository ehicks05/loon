import {observable, computed, action} from 'mobx';
import {createTransformer} from "mobx-utils";

export class AppState {
    @observable tracks;
    @observable trackMap = new Map();
    @observable playlists = [];
    @observable systemSettings = [];
    @observable versionInfo = [];
    @observable pendingRequests = 0;
    @observable taskState = {};
    @observable distinctArtists = [];
    @observable systemInfo = [];

    constructor(rootStore) {
        // autorun(() => console.log(this.report));
        this.rootStore = rootStore;

        this.loadTracks();
        this.loadPlaylists();
        this.loadVersionInfo();
        this.loadSystemInfo();
    }

    getPlaylistById = createTransformer(id => this.playlists.find(playlist => playlist.id === id));
    getTrackById = createTransformer(id => this.tracks.find(track => track.id === id));

    @action
    logout()
    {
        return this.rootStore.myFetch('/logout', {method: 'POST'});
    }

    @action
    loadPlaylists()
    {
        return fetch('/api/playlists/getPlaylists', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                data.forEach(playlist => {
                    playlist.playlistTracks.sort((o1, o2) => {
                        if (o1.index === o2.index) return 0;
                        if (o1.index < o2.index) return -1;
                        if (o1.index > o2.index) return 1;
                    })
                });
                this.playlists.replace(data);
            });
    }

    @action
    loadTracks()
    {
        return fetch('/api/library', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                this.tracks = data;

                this.trackMap.clear();
                this.tracks.forEach(track => {
                    this.trackMap.set(track.id, track);
                });

                const artists = data.map(track => track.artist);
                this.distinctArtists = [...new Set(artists)];
            });
    }

    @action
    loadVersionInfo()
    {
        return fetch('/api/commitId', {method: 'GET'})
            .then(response => response.json())
            .then(data => this.versionInfo = data);
    }

    @action
    loadSystemInfo()
    {
        return fetch('/api/admin/systemInfo', {method: 'GET'})
            .then(response => response.json())
            .then(data => this.systemInfo = data);
    }

    @action
    addOrModifyPlaylist(formData) {
        return this.rootStore.myFetch('/api/playlists/addOrModify', {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => { this.loadPlaylists(); });
    }

    @action
    toggleTracksInPlaylist(playlistId, formData) {
        return this.rootStore.myFetch('/api/playlists/' + playlistId, {method: 'POST', body: formData})
            .then(response => response.text())
            .then(data => { this.loadPlaylists(); });
    }

    @action
    copyPlaylist(formData) {
        return this.rootStore.myFetch('/api/playlists/copyFrom', {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {this.loadPlaylists(); return data;});
    }

    @action
    deletePlaylist(playlistId) {
        return this.rootStore.myFetch('/api/playlists/' + playlistId, {method: 'DELETE'})
            .then(response => response.text())
            .then(data => {this.loadPlaylists();});
    }

    // This will will update the playlist indices locally so the change can be rendered immediately,
    // then request the backend to do the same logic and return the updated playlist data back to the client.
    // This data should be identical to the updates we made locally, but in case anything goes wrong
    // the backend will be our source of truth.
    @action
    dragAndDrop(formData) {
        const oldIndex = Number(formData.get('oldIndex'));
        const newIndex = Number(formData.get('newIndex'));
        const low = Math.min(oldIndex, newIndex);
        const high = Math.max(oldIndex, newIndex);
        const adjustBy = newIndex < oldIndex ? 1 : -1;
        const playlistId = Number(formData.get('playlistId'));

        const playlistIndex = this.playlists.findIndex(playlist => playlist.id === playlistId);
        const playlist = this.playlists[playlistIndex];

        let updatedTracks = playlist.playlistTracks.slice();
        updatedTracks.forEach(playlistTrack => {
            if (playlistTrack.index >= low && playlistTrack.index <= high) {
                playlistTrack.index = playlistTrack.index === oldIndex ? newIndex : playlistTrack.index + adjustBy
            }
        });

        updatedTracks = updatedTracks.sort((o1, o2) => {
            if (o1.index === o2.index) return 0;
            if (o1.index < o2.index) return -1;
            if (o1.index > o2.index) return 1;
        });

        playlist.playlistTracks = updatedTracks;

        this.rootStore.myFetch('/api/playlists/dragAndDrop', {method: 'POST', body: formData})
            .then(response => response.text())
            .then(data => {this.loadPlaylists();});
    }

    @action
    clearPlaylist(playlistId) {
        const formData = new FormData();
        formData.append("mode", '');
        formData.append("replaceExisting", true);
        formData.append("trackIds", []);

        return this.rootStore.myFetch('/api/playlists/' + playlistId, {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {this.loadPlaylists();});
    }

    // LOON SYSTEM CALLS //

    @action
    updateSystemSettings(formData) {
        return this.rootStore.myFetch('/api/admin/systemSettings', {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    // USER CALLS //

    @action
    createUser(formData) {
        return this.rootStore.myFetch('/api/admin/users', {method: 'POST', body: formData})
            .then(response => response.json());
    }

    @action
    updateUser(id, formData) {
        return this.rootStore.myFetch('/api/admin/users/' + id, {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    @action
    deleteUser(id) {
        return this.rootStore.myFetch('/api/admin/users/' + id, {method: 'DELETE'})
            .then(response => response.text());
    }

    @action
    loadUsers() {
        return fetch('/api/admin/users', {method: 'GET'})
            .then(response => response.json());
    }

    // TASK STATE //
    @action
    setTaskState(taskState) {
        this.taskState = taskState;
    }

    @computed
    get tasksInProgress() {
        const tasks = this.taskState.tasks;
        if (!tasks)
            return null;

        let inProgress = Object.entries(tasks).filter((entry) => entry[1].status === 'incomplete');
        if (inProgress.filter((task) => task[0] === 'LibrarySyncTask').length === 1)
            inProgress = inProgress.filter((task) => task[0] === 'LibrarySyncTask');

        return inProgress;
    }
}