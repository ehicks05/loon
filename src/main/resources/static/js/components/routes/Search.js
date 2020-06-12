import React, {useContext, useEffect, useRef, useState} from 'react';
import MediaItem from "../MediaItem";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized'
import TextInput from "../TextInput";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "../../common/AppContextProvider";
import {UserContext} from "../../common/UserContextProvider";
import useDebounce from "../../common/UseDebounce";
import useWindowSize from "../../common/WindowSizeHook";

export default function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchKey, setSearchKey] = useState('');

    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();
    const windowSizeDebounced = useDebounce(windowSize, 250);

    const cache = useRef(new CellMeasurerCache({fixedWidth: true, defaultHeight: 58}))
    const listRef = useRef({});

    const debouncedSearchKey = useDebounce(searchKey, 250);

    useEffect(() => {
        cache.current.clearAll();

        setSearchResults(appContext.tracks)

        return function cleanup() {
            userContext.selectedContextMenuId = '';
        }
    }, []);

    useEffect(() => {
        cache.current.clearAll();
        listRef.current.recomputeRowHeights();
        listRef.current.forceUpdateGrid();
    }, [windowSizeDebounced.width])

    useEffect(() => {
        const key = debouncedSearchKey.toLowerCase();
        const tracks = key.length > 0 ? appContext.tracks.filter(track => {
            return track.title.toLowerCase().includes(key) ||
                track.artist.toLowerCase().includes(key) ||
                track.albumArtist.toLowerCase().includes(key) ||
                track.album.toLowerCase().includes(key);
        }) : appContext.tracks;

        setSearchResults(tracks);

    }, [debouncedSearchKey])

    function handleSearchInput(e)
    {
        setSearchKey(e.target.value);
    }

    const selectedTrackId = userContext.user.userState.selectedTrackId;
    const scrollToIndex = searchResults.indexOf(searchResults.find(track => track.id === selectedTrackId));

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', overflow: 'hidden'}}>
            <section className={'section'} style={{display: 'flex', flexDirection: 'column'}}>
                <form><TextInput id={'searchInput'} label={'Search'} leftIcon={faSearch} value={searchKey}
                                 onChange={handleSearchInput} horizontal={false} hideLabel={true} autoComplete='off' /></form>
            </section>

            <div id="list" style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', flexGrow: '1'}}>
                <AutoSizer style={{outline:0}}>
                    {
                        ({ width, height }) => {
                            return <List
                                ref={setListRef}
                                width={width}
                                height={height}
                                deferredMeasurementCache={cache.current}
                                rowHeight={cache.current.rowHeight}
                                rowRenderer={renderRow}
                                rowCount={searchResults.length}
                                scrollToAlignment={'auto'}
                                scrollToIndex={scrollToIndex}
                                estimatedRowSize={58}
                                overscanRowCount={3} />
                        }
                    }
                </AutoSizer>
            </div>
        </div>
    );

    function renderRow({ index, key, style, parent }) {
        const track = searchResults[index];
        return (
            <CellMeasurer
                key={key}
                cache={cache.current}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>

                <div style={style}>
                    <MediaItem key={key} playlistId={0} track={track} style={style} trackNumber={index + 1} />
                </div>

            </CellMeasurer>
        );
    }

    function setListRef(ref) {
        listRef.current = ref;
    }
}