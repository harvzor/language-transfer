import React, { Component } from 'react'
import AudioUi from './AudioUi'
import progress from '../services/ProgressService'

class TrackItem extends Component {
    state = {
        isComplete: progress.getTrack(this.props.lesson.id) == null ? false : progress.getTrack(this.props.lesson.id).complete
    }
    handleClick = (event) => {
        event.preventDefault()

        AudioUi.audio.changeTrack(this.props.lesson.id)

        this.props.trackSelected(this.props.id)
    }
    completionHandleClick = (event) => {
        event.preventDefault()

        progress.toggleComplete(this.props.lesson.id)

        this.setState(() => ({
            isComplete: progress.getTrack(this.props.lesson.id).complete
        }))
    }
    render() {
        return (
            <li className={this.props.selected ? "selected" : ""}>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.handleClick}>{this.props.lesson.title}</a>
                <a href={'#' + this.props.lesson.id} data-id={this.props.lesson.id} onClick={this.completionHandleClick}>Mark {this.state.isComplete ? "uncomplete" : "complete"}</a>
            </li>
        )
    }
}

export default TrackItem
