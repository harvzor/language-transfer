import React, { Component } from 'react'
import TrackItem from './TrackItem'

class TrackList extends Component {
    state = {
        // The index of the selected track.
        selected: null
    }
    handleTrackClick = (lesson) => {
        this.setState(() => ({
            selected: lesson.lessonId - 1
        }))

        this.props.trackSelected(lesson)
    }
    render() {
        return (
            <ul>
                {this.props.lessons.map((lesson, i) =>
                    <TrackItem
                        selected={i === this.state.selected}
                        trackSelected={this.handleTrackClick}
                        updateCompletionVisualisation={this.props.updateCompletionVisualisation}
                        lesson={lesson}
                        key={i}
                    />
                )}
            </ul>
        )
    }
}

export default TrackList
