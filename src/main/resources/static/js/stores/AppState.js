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

    @computed get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }
}