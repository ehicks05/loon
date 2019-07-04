import {observable, computed, autorun, action} from 'mobx';

export class AppState {
    @observable tracks;
    @observable playlists;
    @observable systemSettings = [];
    @observable versionInfo = [];
    @observable pendingRequests = 0;

    constructor(rootStore) {
        // autorun(() => console.log(this.report));
        this.rootStore = rootStore;

        this.loadTracks();
        this.loadPlaylists();
        this.loadVersionInfo();
    }

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
                this.playlists = data;
            });
    }

    @action
    loadTracks()
    {
        return fetch('/api/library', {method: 'GET'})
            .then(response => response.json()).then(data => this.tracks = data);
    }

    @action
    loadVersionInfo()
    {
        return fetch('/api/commitId', {method: 'GET'})
            .then(response => response.json())
            .then(data => this.versionInfo = data);
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

    @action
    dragAndDrop(formData) {
        return this.rootStore.myFetch('/api/playlists/dragAndDrop', {method: 'POST', body: formData})
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
}