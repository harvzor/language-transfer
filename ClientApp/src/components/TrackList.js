import React, { Component } from 'react'
import TrackItem from './TrackItem'

class TrackList extends Component {
    state = {
        // The index of the selected track.
        selected: null
    }
    handleTrackClick = (i) => {
        this.setState(() => ({
            selected: i
        }))

        this.props.trackSelected()
    }
    render() {
        return (
            <ul>
                {this.props.tracks.map((track, i) =>
                    <TrackItem selected={i === this.state.selected} trackSelected={this.handleTrackClick} track={track} id={i} key={i} />
                )}
            </ul>
        )
    }
}

export default TrackList
