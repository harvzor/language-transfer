import React, { Component } from 'react'
import AudioUi from './AudioUi'
import progress from '../services/ProgressService'

class TrackItem extends Component {
    state = {
        isComplete: progress.getTrack(this.props.track.id) == null ? false : progress.getTrack(this.props.track.id).complete
    }
    handleClick = (event) => {
        event.preventDefault()

        AudioUi.audio.changeTrack(this.props.track.id)

        this.props.trackSelected(this.props.id)
    }
    completionHandleClick = (event) => {
        event.preventDefault()

        progress.toggleComplete(this.props.track.id)

        this.setState(() => ({
            isComplete: progress.getTrack(this.props.track.id).complete
        }))
    }
    render() {
        return (
            <li className={this.props.selected ? "selected" : ""}>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.handleClick}>Track {this.props.id + 1}</a>
                <a href={this.props.track.id} data-id={this.props.track.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

export default TrackItem
