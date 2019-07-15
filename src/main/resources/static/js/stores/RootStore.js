import {AppState} from "./AppState";
import {UiState} from "./UiState";
import {computed, observable} from "mobx";
import fetchDefaults from 'fetch-defaults'

export class RootStore {

    @observable csrfHeader;
    @observable csrfToken;

    constructor() {
        this.appState = new AppState(this);
        this.uiState = new UiState(this);

        this.csrfHeader = document.head.querySelector("[name~=_csrf_header][content]").content;
        this.csrfToken = document.head.querySelector("[name~=_csrf][content]").content;

        this.myFetch = fetchDefaults(window.fetch, "", {
            headers: {[this.csrfHeader]: this.csrfToken}
        });
    }

    @computed get dataLoaded() {
        return this.appState.tracks && this.appState.playlists && this.uiState.user && this.uiState.theme
    }

}