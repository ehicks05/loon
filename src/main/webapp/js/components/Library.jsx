import React from 'react';
import MediaItem from "./MediaItem.jsx";

export default class Library extends React.Component {
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
                <section className="section" id="root">
                    <div className="columns is-multiline is-centered">
                        <div className="column is-three-fifths">
                            <h5 className="subtitle is-5">Playlist</h5>

                            <div id="playlist" className="playlist">
                                <table className={'table is-fullwidth is-hoverable is-narrow'} id="list">
                                    {
                                        this.props.audioTracks.map((audioTrack, index) =>
                                            <MediaItem key={audioTrack.id} track={audioTrack} index={index} currentTrackIndex={this.props.currentTrackIndex}
                                                       onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange}/>
                                        )
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                    <div style={{height: '150px'}}>

                    </div>
                </section>
            </div>);
    }
}