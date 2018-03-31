import React from 'react';
import MediaItem from "./MediaItem.jsx";

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleCurrentTrackIndexChange = this.handleCurrentTrackIndexChange.bind(this);
    }

    handleCurrentTrackIndexChange(newIndex)
    {
        this.props.onCurrentTrackIndexChange(newIndex);
    }

    render()
    {
        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Playlist</h1>
                    </div>
                </section>

                <section className="section" id="root">
                    <div className="columns is-multiline is-centered">
                        <div className="column is-four-fifths">

                            <div id="playlist" className="playlist">
                                <table className={'table is-fullwidth is-hoverable is-narrow is-striped'} id="list">
                                    <tbody>
                                    {
                                        this.props.audioTracks.map((audioTrack, index) =>
                                            <MediaItem key={audioTrack.id} track={audioTrack} index={index}
                                                       currentTrackIndex={this.props.currentTrackIndex}
                                                       onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange}/>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Prevents the PlaybackControls from covering up the last few tracks. */}
                    <div style={{height: '150px'}} />
                </section>
            </div>);
    }
}