import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized'
import debounce from "lodash.debounce";
import TextInput from "./TextInput.jsx";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {inject, observer} from "mobx-react";
import {autorun} from "mobx";

@inject('store')
@observer
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.setListRef = this.setListRef.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
        this.emitChangeDebounced = debounce(this.emitChange, 250);

        this.state = {searchResults: [], searchKey: '', loweredSearchKey: ''};
        this.cache = new CellMeasurerCache({fixedWidth: true, defaultHeight: 58});
    }

    componentDidMount()
    {
        const self = this;
        this.cache.clearAll();
        this.disposer = autorun(() => {
            const width = self.props.store.uiState.windowDimensions.width;
            const height = self.props.store.uiState.windowDimensions.height;
            const theme = self.props.store.uiState.theme;

            // wait 1 second, otherwise sometimes there are huge gaps between rows, especially when toggling light/dark mode.
            setTimeout(function () {
                self.cache.clearAll();
                self.listRef.recomputeRowHeights();
                self.listRef.forceUpdateGrid();
            }, 1000)
        });
        this.setState({
            searchResults: this.props.store.appState.tracks
        });
    }

    componentWillUnmount()
    {
        this.disposer();
        this.props.store.uiState.selectedContextMenuId = '';
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.loweredSearchKey !== prevState.loweredSearchKey)
        {
            const key = this.state.loweredSearchKey;
            const tracks = key.length > 0 ? this.props.store.appState.tracks.filter(track => {
                return track.title.toLowerCase().includes(key) ||
                    track.artist.toLowerCase().includes(key) ||
                    track.albumArtist.toLowerCase().includes(key) ||
                    track.album.toLowerCase().includes(key);
            }) : this.props.store.appState.tracks;
            this.setState({searchResults: tracks});
            
            this.cache.clearAll();
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

    render()
    {
        const selectedTrackId = this.props.store.uiState.selectedTrackId;
        const scrollToIndex = this.state.searchResults.indexOf(this.state.searchResults.find(track => track.id === selectedTrackId));
        const inputClass = this.props.store.uiState.isDarkTheme ? ' has-text-light has-background-dark' : '';
        const theme = this.props.store.uiState.theme; // seems to help prevent the 'huge gaps between rows' issue when toggling theme.

        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', overflow: 'hidden'}}>
                <section className={'section'} style={{display: 'flex', flexDirection: 'column'}}>
                    <form><TextInput id={'searchInput'} label={'Search'} leftIcon={faSearch} value={this.state.searchKey}
                                     onChange={this.handleSearchKeyChange} horizontal={false} hideLabel={true} autoComplete='off' inputClass={inputClass} /></form>
                </section>

                <div id="list" style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', flexGrow: '1'}}>
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
                                    scrollToAlignment={'center'}
                                    scrollToIndex={scrollToIndex}
                                    estimatedRowSize={58}
                                    overscanRowCount={3} />
                            }
                        }
                    </AutoSizer>
                </div>
            </div>
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
                    <MediaItem key={key} playlistId={0} track={track} style={style} trackNumber={index + 1} />
                </div>

            </CellMeasurer>
        );
    }

    setListRef(ref) {
        this.listRef = ref;
    }
}