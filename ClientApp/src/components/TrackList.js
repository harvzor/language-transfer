import React, { Component } from 'react'
import TrackItem from './TrackItem'

class TrackList extends Component {
    handleTrackClick = (lesson) => {
        this.props.trackSelected(lesson)
    }
    render() {
        return (
            <ul>
                {this.props.lessons.map((lesson, i) =>
                    <TrackItem
                        selected={lesson.lessonId === this.props.selectedLesson}
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
