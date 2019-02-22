import {AppState} from "./AppState";
import {UiState} from "./UiState";
import {computed} from "mobx";

export class RootStore {
    constructor() {
        this.appState = new AppState(this);
        this.uiState = new UiState(this)
    }

    @computed get dataLoaded() {
        return this.appState.tracks && this.appState.playlists && this.uiState.user && this.uiState.theme
    }

}