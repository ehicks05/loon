import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized'

export default class SearchTest extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.renderRow = this.renderRow.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 58
        });

        this.list = this.props.tracks;

        this.selectedTrackId = this.props.selectedTrackId;

        const favoritesPlaylist = this.props.playlists.filter(playlist => playlist.favorites)[0];
        this.favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(0, selectedTrackId);
    }

    render()
    {
        return (
            <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <h1 className="title">Search</h1>

                <div id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    <AutoSizer>
                        {
                            ({ width, height }) => {
                                return <List
                                    width={width}
                                    height={height}
                                    deferredMeasurementCache={this.cache}
                                    rowHeight={this.cache.rowHeight}
                                    rowRenderer={this.renderRow}
                                    rowCount={this.list.length}
                                    overscanRowCount={3} />
                            }
                        }
                    </AutoSizer>
                </div>
            </section>
            // <div>
            //     <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
            //
            //     </div>
            // </div>
        );
    }

    renderRow({ index, key, style, parent }) {
        const track = this.list[index];
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>

                <div style={style}>
                    <MediaItem key={key} track={track} style={style} index={index} selectedTrackId={this.selectedTrackId}
                               onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false} favorite={this.favoritesIds.includes(track.id)} />
                </div>

            </CellMeasurer>
        );
    }
}