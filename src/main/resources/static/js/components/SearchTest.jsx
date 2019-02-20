import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized'

export default class SearchTest extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.renderRow = this.renderRow.bind(this);

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
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(0, selectedTrackId);
    }

    render()
    {
        const scrollToIndex = this.props.tracks.indexOf(this.props.tracks.find(track => track.id === this.props.selectedTrackId));

        return (
            <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <h1 className="title">Search</h1>

                <div id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    <AutoSizer style={{outline:0}}>
                        {
                            ({ width, height }) => {
                                return <List
                                    width={width}
                                    height={height}
                                    deferredMeasurementCache={this.cache}
                                    rowHeight={this.cache.rowHeight}
                                    rowRenderer={this.renderRow}
                                    rowCount={this.props.tracks.length}
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
        const track = this.props.tracks[index];
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
}