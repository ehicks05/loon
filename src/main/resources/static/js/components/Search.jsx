import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized'
import debounce from "lodash.debounce";
import TextInput from "./TextInput.jsx";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.setListRef = this.setListRef.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
        this.emitChangeDebounced = debounce(this.emitChange, 250);

        this.state = {searchResults: this.props.tracks, searchKey: '', loweredSearchKey: ''};
        this.cache = new CellMeasurerCache({fixedWidth: true, defaultHeight: 58});

        const favoritesPlaylist = this.props.playlists.filter(playlist => playlist.favorites)[0];
        this.favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        const queuePlaylist = this.props.playlists.filter(playlist => playlist.queue)[0];
        this.queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.playlists !== prevProps.playlists)
        {
            const favoritesPlaylist = this.props.playlists.filter(playlist => playlist.favorites)[0];
            this.favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
            const queuePlaylist = this.props.playlists.filter(playlist => playlist.queue)[0];
            this.queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        }
        if (this.state.loweredSearchKey !== prevState.loweredSearchKey)
        {
            const key = this.state.loweredSearchKey;
            const tracks = key.length > 0 ? this.props.tracks.filter(track => {
                return track.title.toLowerCase().includes(key) ||
                    track.artist.toLowerCase().includes(key) ||
                    track.albumArtist.toLowerCase().includes(key) ||
                    track.album.toLowerCase().includes(key);
            }) : this.props.tracks;
            this.setState({searchResults: tracks});
            
            this.cache.clearAll();
            // this.listRef.recomputeRowHeights();
            // this.listRef.forceUpdateGrid();
            // this.listRef.measureAllRows();
        }
    }

    handleSearchKeyChange(e)
    {
        this.setState({searchKey: e.target.value});
        this.emitChangeDebounced(e.target.value);
    }

    emitChange(value) {
        this.setState({loweredSearchKey: value.toLowerCase()});
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(0, selectedTrackId);
    }

    render()
    {
        const scrollToIndex = this.state.searchResults.indexOf(this.state.searchResults.find(track => track.id === this.props.selectedTrackId));

        return (
            <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <form><TextInput autofocus={true} id={'searchInput'} label={'Search'} leftIcon={faSearch} value={this.state.searchKey}
                                 onChange={this.handleSearchKeyChange} horizontal={false} hideLabel={true} autoComplete='off' /></form>

                <div id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    <AutoSizer style={{outline:0}}>
                        {
                            ({ width, height }) => {
                                return <List
                                    ref={this.setListRef}
                                    width={width}
                                    height={height}
                                    deferredMeasurementCache={this.cache}
                                    rowHeight={this.cache.rowHeight}
                                    rowRenderer={this.renderRow}
                                    rowCount={this.state.searchResults.length}
                                    scrollToIndex={scrollToIndex}
                                    estimatedRowSize={58}
                                    overscanRowCount={3} />
                            }
                        }
                    </AutoSizer>
                </div>
            </section>
        );
    }

    renderRow({ index, key, style, parent }) {
        const track = this.state.searchResults[index];
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>

                <div style={style}>
                    <MediaItem key={key} track={track} style={style} trackNumber={index + 1} selectedTrackId={this.props.selectedTrackId}
                               onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false}
                               favorite={this.favoritesIds.includes(track.id)} queue={this.queueIds.includes(track.id)}
                               playlists={this.props.playlists}
                    />
                </div>

            </CellMeasurer>
        );
    }

    setListRef(ref) {
        this.listRef = ref;
    }
}