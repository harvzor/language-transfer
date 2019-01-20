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
                {this.props.lessons.map((lesson, i) =>
                    <TrackItem selected={i === this.state.selected} trackSelected={this.handleTrackClick} lesson={lesson} id={i} key={i} />
                )}
            </ul>
        )
    }
}

export default TrackList
