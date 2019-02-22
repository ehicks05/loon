import {observable, computed, autorun, action} from 'mobx';

export class AppState {
    @observable tracks;
    @observable playlists;
    @observable systemSettings = [];
    @observable pendingRequests = 0;

    constructor(rootStore) {
        autorun(() => console.log(this.report));
        this.rootStore = rootStore;

        this.loadTracks();
        this.loadPlaylists();
    }

    @action
    loadPlaylists()
    {
        return fetch('/api/playlists/getPlaylists', {method: 'GET'})
            .then(response => response.json()).then(data => this.playlists = data);
    }

    @action
    loadTracks()
    {
        return fetch('/api/library', {method: 'GET'})
            .then(response => response.json()).then(data => this.tracks = data);
    }

    @action
    handleSetQueueTracks(trackIds) {
        const formData = new FormData();
        formData.append('playlistId', this.state.playlists.find(playlist => playlist.queue).id);
        formData.append('trackIds', trackIds);
        fetch('/api/playlists/setTracks', {method: 'PUT', body: formData})
            .then(this.reloadPlaylists);
    }

    @computed get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }
}