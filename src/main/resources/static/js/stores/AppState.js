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

    @computed get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }
}